<?php

namespace App\Services;

class BudgetAllocationService
{
  public function calculate($budget)
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

  protected function budgetUnder600($budget)
  {
    return [
      'cpu' => $budget * 0.30,
      'mobo' => $budget * 0.17,
      'ram' => $budget * 0.18,
      'cooler' => $budget * 0.03,
      'gpu' => 0,
      'ssd' => $budget * 0.15,
      'psu' => $budget * 0.10,
      'case' => $budget * 0.06,
      'fans' => $budget * 0.01
    ];
  }

  protected function budgetUnder900($budget)
  {
    return [
      'cpu' => $budget * 0.18,
      'mobo' => $budget * 0.13,
      'ram' => $budget * 0.14,
      'cooler' => $budget * 0.04,
      'gpu' => $budget * 0.32,
      'ssd' => $budget * 0.10,
      'psu' => $budget * 0.06,
      'case' => $budget * 0.02,
      'fans' => $budget * 0.01
    ];
  }

  protected function budgetUnder1400($budget)
  {
    return [
      'cpu' => $budget * 0.20,
      'mobo' => $budget * 0.11,
      'ram' => $budget * 0.12,
      'cooler' => $budget * 0.04,
      'gpu' => $budget * 0.35,
      'ssd' => $budget * 0.09,
      'psu' => $budget * 0.06,
      'case' => $budget * 0.02,
      'fans' => $budget * 0.01
    ];
  }

  protected function budgetUnder2000($budget)
  {
    return [
      'cpu' => $budget * 0.18,
      'mobo' => $budget * 0.10,
      'ram' => $budget * 0.10,
      'cooler' => $budget * 0.05,
      'gpu' => $budget * 0.40,
      'ssd' => $budget * 0.08,
      'psu' => $budget * 0.06,
      'case' => $budget * 0.02,
      'fans' => $budget * 0.01
    ];
  }

  protected function budgetOver2000($budget)
  {
    return [
      'cpu' => $budget * 0.16,
      'mobo' => $budget * 0.10,
      'ram' => $budget * 0.09,
      'cooler' => $budget * 0.06,
      'gpu' => $budget * 0.42,
      'ssd' => $budget * 0.08,
      'psu' => $budget * 0.06,
      'case' => $budget * 0.02,
      'fans' => $budget * 0.01
    ];
  }
}
