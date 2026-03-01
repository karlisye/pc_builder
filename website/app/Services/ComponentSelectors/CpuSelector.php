<?php

namespace App\Services\ComponentSelectors;

use App\Models\Processor;

class CpuSelector
{
  public function select($cpuBudget, $totalBudget = null)
  {
    if ($totalBudget && $totalBudget < 600) {
      return $this->selectApu($cpuBudget);
    }

    return $this->selectStandardCpu($cpuBudget);
  }

  protected function selectApu($budget)
  {
    return Processor::whereNotNull('socket')
      ->whereNotNull('cores')
      ->whereNotNull('price')
      ->whereNotNull('integrated_graphics')
      ->where('price', '<=', $budget)
      ->whereNotIn('socket', ['sWRX8', 'sTR5'])
      ->where('name', 'NOT LIKE', '%Threadripper%')
      ->where('name', 'NOT LIKE', '%PRO%')
      ->orderByDesc('cores')
      ->orderByDesc('price')
      ->first();
  }

  protected function selectStandardCpu($budget)
  {
    return Processor::whereNotNull('socket')
      ->whereNotNull('cores')
      ->whereNotNull('price')
      ->where('price', '<=', $budget)
      ->whereNotIn('socket', ['sWRX8', 'sTR5'])
      ->where('name', 'NOT LIKE', '%Threadripper%')
      ->where('name', 'NOT LIKE', '%PRO%')
      ->orderByDesc('cores')
      ->orderByDesc('frequency')
      ->first();
  }

  public function hasIntegratedGraphics($cpu)
  {
    return $cpu && $cpu->integrated_graphics !== null;
  }
}
