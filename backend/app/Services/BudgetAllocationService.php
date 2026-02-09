<?php

namespace App\Services;

class BudgetAllocationService
{
  public function calculate($budget)
  {
    if ($budget < 600) {
      return $this->budgetUnder600($budget);
    } elseif ($budget < 1000) {
      return $this->budgetUnder1000($budget);
    } elseif ($budget < 2000) {
      return $this->budgetUnder2000($budget);
    } else {
      return $this->budgetOver2000($budget);
    }
  }

  protected function budgetUnder600($budget)
  {
    return [
      'cpu' => $budget * 0.25,
      'mobo' => $budget * 0.13,
      'ram' => $budget * 0.11,
      'cooler' => $budget * 0.04,
      'gpu' => $budget * 0.23,
      'ssd' => $budget * 0.09,
      'psu' => $budget * 0.08,
      'case' => $budget * 0.05,
      'fans' => $budget * 0.02
    ];
  }

  protected function budgetUnder1000($budget)
  {
    return [
      'cpu' => $budget * 0.21,
      'mobo' => $budget * 0.10,
      'ram' => $budget * 0.13,
      'cooler' => $budget * 0.04,
      'gpu' => $budget * 0.30,
      'ssd' => $budget * 0.08,
      'psu' => $budget * 0.07,
      'case' => $budget * 0.05,
      'fans' => $budget * 0.02
    ];
  }

  protected function budgetUnder2000($budget)
  {
    return [
      'cpu' => $budget * 0.18,
      'mobo' => $budget * 0.10,
      'ram' => $budget * 0.10,
      'cooler' => $budget * 0.05,
      'gpu' => $budget * 0.36,
      'ssd' => $budget * 0.08,
      'psu' => $budget * 0.07,
      'case' => $budget * 0.05,
      'fans' => $budget * 0.01
    ];
  }

  protected function budgetOver2000($budget)
  {
    return [
      'cpu' => $budget * 0.16,
      'mobo' => $budget * 0.10,
      'ram' => $budget * 0.10,
      'cooler' => $budget * 0.06,
      'gpu' => $budget * 0.38,
      'ssd' => $budget * 0.08,
      'psu' => $budget * 0.07,
      'case' => $budget * 0.04,
      'fans' => $budget * 0.01
    ];
  }
}
