<?php

namespace App\Services;

class BudgetAllocationService
{
  public function calculateInitial($budget)
  {
    if ($budget < 600) {
      return $this->budgetUnder600($budget);
    } elseif ($budget < 900) {
      return $this->budgetUnder900($budget);
    } elseif ($budget < 1400) {
      return $this->budgetUnder1400($budget);
    } elseif ($budget < 2000) {
      return $this->budgetUnder2000($budget);
    } else {
      return $this->budgetOver2000($budget);
    }
  }

  public function recalculateRemaining($remainingBudget, $selectedComponents = [])
  {
    $needed = $this->getNeededComponents($selectedComponents, $remainingBudget);

    $totalPercentage = array_sum($needed);

    $allocations = [];
    foreach ($needed as $component => $percentage) {
      $allocations[$component] = ($percentage / $totalPercentage) * $remainingBudget;
    }

    return $allocations;
  }

  protected function getNeededComponents($selectedComponents, $budget)
  {
    $baseRatios = $this->getBaseRatios($budget);

    foreach ($selectedComponents as $component) {
      unset($baseRatios[$component]);
    }

    return $baseRatios;
  }

  protected function getBaseRatios($budget)
  {
    if ($budget < 600) {
      return [
        'cpu' => 30,
        'mobo' => 17,
        'ram' => 18,
        'cooler' => 3,
        'gpu' => 0,
        'ssd' => 15,
        'psu' => 10,
        'case' => 6,
        'fans' => 1
      ];
    } elseif ($budget < 900) {
      return [
        'cpu' => 18,
        'mobo' => 13,
        'ram' => 14,
        'cooler' => 4,
        'gpu' => 32,
        'ssd' => 10,
        'psu' => 6,
        'case' => 2,
        'fans' => 1
      ];
    } elseif ($budget < 1400) {
      return [
        'cpu' => 20,
        'mobo' => 11,
        'ram' => 12,
        'cooler' => 4,
        'gpu' => 35,
        'ssd' => 9,
        'psu' => 6,
        'case' => 2,
        'fans' => 1
      ];
    } elseif ($budget < 2000) {
      return [
        'cpu' => 18,
        'mobo' => 10,
        'ram' => 10,
        'cooler' => 5,
        'gpu' => 40,
        'ssd' => 8,
        'psu' => 6,
        'case' => 2,
        'fans' => 1
      ];
    } else {
      return [
        'cpu' => 16,
        'mobo' => 10,
        'ram' => 9,
        'cooler' => 6,
        'gpu' => 42,
        'ssd' => 8,
        'psu' => 6,
        'case' => 2,
        'fans' => 1
      ];
    }
  }

  protected function budgetUnder600($budget)
  {
    $ratios = $this->getBaseRatios($budget);
    $allocations = [];
    foreach ($ratios as $component => $percentage) {
      $allocations[$component] = $budget * ($percentage / 100);
    }
    return $allocations;
  }

  protected function budgetUnder900($budget)
  {
    $ratios = $this->getBaseRatios($budget);
    $allocations = [];
    foreach ($ratios as $component => $percentage) {
      $allocations[$component] = $budget * ($percentage / 100);
    }
    return $allocations;
  }

  protected function budgetUnder1400($budget)
  {
    $ratios = $this->getBaseRatios($budget);
    $allocations = [];
    foreach ($ratios as $component => $percentage) {
      $allocations[$component] = $budget * ($percentage / 100);
    }
    return $allocations;
  }

  protected function budgetUnder2000($budget)
  {
    $ratios = $this->getBaseRatios($budget);
    $allocations = [];
    foreach ($ratios as $component => $percentage) {
      $allocations[$component] = $budget * ($percentage / 100);
    }
    return $allocations;
  }

  protected function budgetOver2000($budget)
  {
    $ratios = $this->getBaseRatios($budget);
    $allocations = [];
    foreach ($ratios as $component => $percentage) {
      $allocations[$component] = $budget * ($percentage / 100);
    }
    return $allocations;
  }
}
