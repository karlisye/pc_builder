<?php

namespace App\Services;

use Illuminate\Database\Eloquent\Model;

class BuilderService
{
  private const TIERS = [
    'budget' => [
      'cpu' => 0.22,
      'motherboard' => 0.17,
      'ram' => 0.24,
      'case' => 0.12,
      'psu' => 0.10,
      'ssd' => 0.15,
    ],
    'mid' => [
      'gpu' => 0.27,
      'cpu' => 0.14,
      'motherboard' => 0.10,
      'ram' => 0.20,
      'cooler' => 0.03,
      'case' => 0.07,
      'psu' => 0.07,
      'ssd' => 0.12,
    ],
    'high' => [
      'gpu' => 0.27,
      'cpu' => 0.12,
      'motherboard' => 0.10,
      'ram' => 0.23,
      'cooler' => 0.02,
      'case' => 0.06,
      'psu' => 0.06,
      'ssd' => 0.14,
    ],
  ];

  private const MAX_ATTEMPTS = 5;
  private const RETRY_REDUCTION = 0.02;

  public function __construct(
    private readonly BuilderSlotPicker $picker
  ) {}

  public function generate(array $selected, ?float $budget, array $preferences): array
  {
    if ($budget === null) {
      return $this->generateUnlimited($selected, $preferences);
    }

    $tier = $this->resolveTier($budget);
    $allocations = self::TIERS[$tier];
    $selectedCost = $this->totalCost($selected);
    $remainingBudget = $budget - $selectedCost;

    if ($remainingBudget <= 0) {
      return $this->errorResponse(
        'Selected components already exceed or meet the budget.',
      );
    }

    $slotsToFill = $this->resolveSlotsToFill($selected, $allocations);

    for ($attempt = 1; $attempt <= self::MAX_ATTEMPTS; $attempt++) {
      $attemptBudget = $remainingBudget * (1 - ($attempt - 1) * self::RETRY_REDUCTION);

      $result = $this->attempt($slotsToFill, $selected, $attemptBudget, $allocations, $preferences);

      if ($result !== null) {
        $build = array_merge($selected, $result);
        $totalCost = $this->totalCost($build);

        return [
          'success' => true,
          'build' => $this->serializeBuild($build),
          'total_price' => round($totalCost, 2),
          'remaining_budget' => round($budget - $totalCost, 2),
          'attempts_needed' => $attempt,
          'error' => null,
          'estimated_minimum_budget'  => null,
        ];
      }
    }

    // all attempts failed - estimate minimum budget
    $estimatedMinimum = $this->estimateMinimumBudget($slotsToFill, $selected, $selectedCost);

    return $this->errorResponse(
      "Could not find compatible parts within the given budget. "
        . "Estimated minimum budget needed: €" . number_format($estimatedMinimum, 2) . ".",
      $estimatedMinimum
    );
  }

  private function attempt(
    array $slotsToFill,
    array $selected,
    float $attemptBudget,
    array $allocations,
    array $preferences
  ): ?array {
    $build = $selected;
    $spentThisRound = 0.0;
    $remainingSlots = $slotsToFill;
    $filled = [];

    while (! empty($remainingSlots)) {
      $budgetLeft = $attemptBudget - $spentThisRound;

      $remainingAllocationSum = array_sum(
        array_intersect_key($allocations, array_flip($remainingSlots))
      );

      $pickedAny = false;

      foreach ($remainingSlots as $index => $slot) {
        $slotShare = ($remainingAllocationSum > 0)
          ? (($allocations[$slot] ?? 0) / $remainingAllocationSum)
          : (1 / count($remainingSlots));

        $slotBudget = $budgetLeft * $slotShare;

        // for slots with no allocation key (ssd, fan)
        if (! isset($allocations[$slot])) {
          $slotBudget = $budgetLeft;
        }

        $picked = $this->picker->pick($slot, $slotBudget, $build, $preferences);

        if ($picked === null) {
          // cant fill this slot - fail the attempt
          if ($this->isRequired($slot)) {
            return null;
          }
          // skip optional (fan)
          unset($remainingSlots[$index]);
          continue;
        }

        $price = (float) $picked->price;
        $build[$slot] = $picked;
        $filled[$slot] = $picked;
        $spentThisRound += $price;
        unset($remainingSlots[$index]);
        $pickedAny = true;

        $remainingSlots = $this->reEvaluateSkips($remainingSlots, $build);

        break; // restart loop with updated budget after each pick
      }

      // if nothing was picked and slots remain - fail
      if (! $pickedAny && ! empty($remainingSlots)) {
        return null;
      }
    }

    return $filled;
  }

  private function generateUnlimited(array $selected, array $preferences): array
  {
    $allSlots = array_keys(CompatibilityService::VALID_TYPES);
    $slotsToFill = array_diff($allSlots, array_keys($selected), ['fan']); // fan last
    $build = $selected;

    foreach ($slotsToFill as $slot) {
      $picked = $this->picker->pickMostExpensive($slot, $build, $preferences);
      if ($picked) {
        $build[$slot] = $picked;
      }
    }

    // add fan at the end
    $fan = $this->picker->pickMostExpensive('fan', $build, $preferences);
    if ($fan) {
      $build['fan'] = $fan;
    }

    $totalCost = $this->totalCost($build);

    return [
      'success' => true,
      'build' => $this->serializeBuild($build),
      'total_price' => round($totalCost, 2),
      'remaining_budget' => null,
      'attempts_needed' => 1,
      'error' => null,
      'estimated_minimum_budget' => null,
    ];
  }

  // add indivudual
  private function resolveSlotsToFill(array $selected, array $allocations): array
  {
    $orderedSlots = ['cpu', 'gpu', 'motherboard', 'ram', 'cooler', 'case', 'psu', 'ssd', 'fan'];

    $slotsToFill = [];

    foreach ($orderedSlots as $slot) {
      if (isset($selected[$slot])) {
        continue;
      }

      // if not needed for the budget or is ssd or fan - skip
      if (! isset($allocations[$slot]) && ! in_array($slot, ['ssd', 'fan'])) {
        continue;
      }

      $slotsToFill[] = $slot;
    }

    $slotsToFill = $this->reEvaluateSkips($slotsToFill, $selected);

    return array_values($slotsToFill);
  }

  // check if cooler and psu should be skipped
  private function reEvaluateSkips(array $slots, array $build): array
  {
    return array_values(array_filter($slots, function ($slot) use ($build) {
      if ($slot === 'cooler' && $this->shouldSkipCooler($build)) {
        return false;
      }
      if ($slot === 'psu' && $this->shouldSkipPsu($build)) {
        return false;
      }
      return true;
    }));
  }

  private function shouldSkipCooler(array $build): bool
  {
    $cpu = $build['cpu'] ?? null;
    return $cpu && $cpu->cooler_included === true;
  }

  private function shouldSkipPsu(array $build): bool
  {
    $case = $build['case'] ?? null;
    $cpu = $build['cpu'] ?? null;
    $gpu = $build['gpu'] ?? null;

    if (! $case || $case->psu_wattage <= 1) {
      return false;
    }

    $cpuTdp = $cpu?->tdp ?? 0;
    $gpuTdp = $gpu?->tdp ?? 0;

    return $case->psu_wattage >= ($cpuTdp + $gpuTdp) * 1.3;
  }

  private function isRequired(string $slot): bool
  {
    return ! in_array($slot, ['fan', 'ssd']);
  }

  private function resolveTier(float $budget): string
  {
    if ($budget < 500) return 'budget';
    if ($budget <= 1500) return 'mid';
    return 'high';
  }

  private function totalCost(array $build): float
  {
    return array_sum(array_map(fn($item) => (float) $item->price, $build));
  }

  // get cheapest from each necessary component
  private function estimateMinimumBudget(array $slotsToFill, array $selected, float $selectedCost): float
  {
    $minimum = $selectedCost;

    foreach ($slotsToFill as $slot) {
      $cheapest = $this->picker->cheapest($slot, $selected);
      if ($cheapest) {
        $minimum += (float) $cheapest->price;
      }
    }

    return round($minimum, 2);
  }

  // get only the raw data instead of objects
  private function serializeBuild(array $build): array
  {
    $serialized = [];
    foreach ($build as $type => $model) {
      $serialized[$type] = $model->toArray();
    }
    return $serialized;
  }

  private function errorResponse(string $message, ?float $estimatedMinimum = null): array
  {
    return [
      'success' => false,
      'build' => null,
      'total_price' => null,
      'remaining_budget' => null,
      'attempts_needed' => self::MAX_ATTEMPTS,
      'error' => $message,
      'estimated_minimum_budget' => $estimatedMinimum,
    ];
  }
}
