<?php

namespace App\Services;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Log;

class BuilderService
{
  // updated tiers, still needs improvements
  private const TIERS = [
    'budget' => [
      'gaming'    => ['cpu' => 0.25, 'motherboard' => 0.20, 'ram' => 0.25, 'case' => 0.10, 'psu' => 0.10, 'ssd' => 0.10],
      'office'    => ['cpu' => 0.28, 'motherboard' => 0.22, 'ram' => 0.25, 'case' => 0.09, 'psu' => 0.09, 'ssd' => 0.07],
      'rendering' => ['cpu' => 0.25, 'motherboard' => 0.20, 'ram' => 0.25, 'case' => 0.10, 'psu' => 0.10, 'ssd' => 0.10],
      'streaming' => ['cpu' => 0.27, 'motherboard' => 0.20, 'ram' => 0.23, 'case' => 0.10, 'psu' => 0.10, 'ssd' => 0.10],
    ],
    'mid' => [
      'gaming'    => ['gpu' => 0.27, 'cpu' => 0.14, 'motherboard' => 0.10, 'ram' => 0.20, 'cooler' => 0.03, 'case' => 0.07, 'psu' => 0.07, 'ssd' => 0.12],
      'office'    => ['cpu' => 0.25, 'motherboard' => 0.18, 'ram' => 0.30, 'cooler' => 0.03, 'case' => 0.08, 'psu' => 0.08, 'ssd' => 0.08],
      'rendering' => ['gpu' => 0.22, 'cpu' => 0.18, 'motherboard' => 0.10, 'ram' => 0.25, 'cooler' => 0.03, 'case' => 0.07, 'psu' => 0.07, 'ssd' => 0.08],
      'streaming' => ['gpu' => 0.20, 'cpu' => 0.20, 'motherboard' => 0.10, 'ram' => 0.20, 'cooler' => 0.03, 'case' => 0.07, 'psu' => 0.07, 'ssd' => 0.13],
    ],
    'high' => [
      'gaming'    => ['gpu' => 0.27, 'cpu' => 0.12, 'motherboard' => 0.10, 'ram' => 0.23, 'cooler' => 0.02, 'case' => 0.06, 'psu' => 0.06, 'ssd' => 0.14],
      'office'    => ['cpu' => 0.22, 'motherboard' => 0.16, 'ram' => 0.35, 'cooler' => 0.02, 'case' => 0.06, 'psu' => 0.06, 'ssd' => 0.13],
      'rendering' => ['gpu' => 0.25, 'cpu' => 0.15, 'motherboard' => 0.10, 'ram' => 0.28, 'cooler' => 0.02, 'case' => 0.05, 'psu' => 0.05, 'ssd' => 0.10],
      'streaming' => ['gpu' => 0.22, 'cpu' => 0.20, 'motherboard' => 0.10, 'ram' => 0.22, 'cooler' => 0.02, 'case' => 0.06, 'psu' => 0.06, 'ssd' => 0.12],
    ],
  ];

  private const MAX_ATTEMPTS = 5;
  private const RETRY_REDUCTION = 0.02;

  public function __construct(
    private readonly BuilderSlotPicker $picker
  ) {}

  public function generate(array $selected, ?float $budget, array $preferences, ?string $slotToFill = null): array
  {
    if ($slotToFill !== null) {
      return $this->generateComponent($selected, $slotToFill, $budget, $preferences);
    }

    if ($budget === null) {
      return $this->generateUnlimited($selected, $preferences);
    }

    $tier = $this->resolveTier($budget);
    $preferences['tier'] = $tier;

    $type = $preferences['type'] ?? 'gaming';
    $allocations = self::TIERS[$tier][$type] ?? self::TIERS[$tier]['gaming'];

    // if allocations dont have gpu, then intergated graphics is a must
    if (!isset($allocations['gpu'])) {
      $preferences['integrated_graphics'] = true;
    }

    $selectedCost = $this->totalCost($selected);
    $remainingBudget = $budget - $selectedCost;

    if ($remainingBudget <= 0) {
      return $this->errorResponse(
        'Selected components already exceed or meet the budget.',
      );
    }

    $slotsToFill = $this->resolveSlotsToFill($selected, $allocations);

    // Log::debug('preferences: ' . json_encode($preferences));

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
          'warnings' => $this->generateWarnings($build, $preferences),
          'attempts_needed' => $attempt,
          'error' => null,
          'estimated_minimum_budget'  => null,
        ];
      }
    }

    // all attempts failed - estimate minimum budget
    $estimatedMinimum = $this->estimateMinimumBudget($slotsToFill, $selected, $selectedCost, $preferences);

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

        $picked = $this->picker->pick($slot, $build, $preferences, $slotBudget);

        // if nothing found within allocation, try cheapest compatible option within remaining budget
        if ($picked === null) {
          $cheapest = $this->picker->cheapest($slot, $build, $preferences);
          if ($cheapest && (float) $cheapest->price <= $budgetLeft) {
            $picked = $cheapest;
          }
        }

        if ($picked === null) {
          // cant fill this slot, fail the attempt
          if ($slot !== 'fan') {
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

        // if picked cpu has no bundled cooler and cooler isn't already queued or filled
        if ($slot === 'cpu' && !$picked->cooler_included && !in_array('cooler', $remainingSlots) && !isset($filled['cooler'])) {
          $remainingSlots[] = 'cooler';
        }

        break; // restart loop with updated budget after each pick
      }

      // if nothing was picked and slots remain - fail
      if (! $pickedAny && ! empty($remainingSlots)) {
        return null;
      }
    }

    return $filled;
  }

  private function generateComponent(array $selected, string $slot, ?float $budget, array $preferences): ?array
  {
    $build = $selected;
    $picked = $this->picker->pick($slot, $build, $preferences, $budget);

    if (! $picked) {
      $totalCost = $this->totalCost($build);
      $minimum_budget = $this->picker->cheapest($slot, $selected, $preferences)->price;
      return [
        'success' => false,
        'build' => $this->serializeBuild($build),
        'total_price' => round($totalCost, 2),
        'error' => "Couldn't find compatable components within the budget. Estimated minimum budget is €{$minimum_budget}.",
        'estimated_minimum_budget' => $minimum_budget,
      ];
    }

    $build[$slot] = $picked;
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

  private function generateUnlimited(array $selected, array $preferences): array
  {
    $orderedSlots = ['ssd', 'case', 'psu', 'cooler', 'ram', 'motherboard', 'cpu', 'gpu'];
    $slotsToFill = array_diff($orderedSlots, array_keys($selected));
    $build = $selected;

    foreach ($slotsToFill as $slot) {
      $picked = $this->picker->pick($slot, $build, $preferences);
      if ($picked) {
        $build[$slot] = $picked;
      }
    }

    // add fan at the end
    $fan = $this->picker->pick('fan', $build, $preferences);
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
    $orderedSlots = ['ssd', 'case', 'psu', 'cooler', 'ram', 'motherboard', 'cpu', 'gpu', 'fan'];

    $slotsToFill = [];

    foreach ($orderedSlots as $slot) {
      if (isset($selected[$slot])) {
        continue;
      }

      // if not needed for the budget or is fan - skip
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
  private function estimateMinimumBudget(array $slotsToFill, array $selected, float $selectedCost, array $preferences): float
  {
    $minimum = $selectedCost;
    $build = $selected;

    // compatibility-first order so filters apply correctly
    $compatibilityOrder = ['cpu', 'motherboard', 'ram', 'gpu', 'case', 'cooler', 'psu', 'ssd', 'fan'];
    $ordered = array_values(array_intersect($compatibilityOrder, $slotsToFill));

    foreach ($ordered as $slot) {
      $cheapest = $this->picker->cheapest($slot, $build, $preferences);
      if ($cheapest) {
        $minimum += (float) $cheapest->price;
        $build[$slot] = $cheapest;
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
      'warnings' => [],
      'attempts_needed' => self::MAX_ATTEMPTS,
      'error' => $message,
      'estimated_minimum_budget' => $estimatedMinimum,
    ];
  }

  private function generateWarnings(array $build, array $preferences): array
  {
    $warnings = [];
    $type = $preferences['type'] ?? 'gaming';
    $tier = $preferences['tier'] ?? 'mid';

    // ram capacity check
    $ram = $build['ram'] ?? null;
    if ($ram) {
      $recommendedCapacity = match ($type) {
        'rendering' => match ($tier) {
          'budget' => 16,
          'mid' => 32,
          default => 64
        },
        'gaming', 'streaming' => match ($tier) {
          'budget' => 8,
          default => 16
        },
        default => 8,
      };
      if ($ram->capacity < $recommendedCapacity) {
        $warnings[] = "RAM is below recommended {$recommendedCapacity}GB for {$type} builds at this budget tier.";
        $warnings[] = "RAM is below recommended {$recommendedCapacity}GB for {$type} builds at this budget tier.";
      }
    }

    return $warnings;
  }
}
