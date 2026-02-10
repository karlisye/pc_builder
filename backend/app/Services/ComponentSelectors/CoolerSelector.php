<?php

namespace App\Services\ComponentSelectors;

use App\Models\Cooler;

class CoolerSelector
{
  public function select($budget, $cpu)
  {
    $cpuTdp = $cpu->tdp ?? 65;

    $cooler = $this->selectByTdp($budget, $cpuTdp);
    if ($cooler) return $cooler;

    return $this->selectAny($budget);
  }

  protected function selectByTdp($budget, $cpuTdp)
  {
    return Cooler::whereNotNull('price')
      ->where('price', '<=', $budget)
      ->where(function ($query) use ($cpuTdp) {
        $query->whereNull('tdp')
          ->orWhere('tdp', '>=', $cpuTdp);
      })
      ->orderByDesc('tdp')
      ->orderBy('price', 'asc')
      ->first();
  }

  protected function selectAny($budget)
  {
    return Cooler::whereNotNull('price')
      ->where('price', '<=', $budget)
      ->orderBy('price', 'asc')
      ->first();
  }
}
