<?php

namespace App\Services\ComponentSelectors;

use App\Models\Psu;

class PsuSelector
{
  public function select($budget, $cpu, $gpu)
  {
    $minimumWattage = $this->calculateMinimumWattage($cpu, $gpu);

    $psu = $this->selectWithCertification($budget, $minimumWattage);
    if ($psu) return $psu;

    $psu = $this->selectWithoutCertification($budget, $minimumWattage);
    if ($psu) return $psu;

    return $this->selectAny($budget);
  }

  protected function calculateMinimumWattage($cpu, $gpu)
  {
    $cpuTdp = $cpu->tdp ?? 65;
    $gpuTdp = $gpu ? 250 : 0;
    $minimumWattage = ceil(($cpuTdp + $gpuTdp + 100) / 50) * 50;

    return max(450, min($minimumWattage, 850));
  }

  protected function selectWithCertification($budget, $minimumWattage)
  {
    return Psu::whereNotNull('wattage')
      ->whereNotNull('price')
      ->where('price', '<=', $budget)
      ->where('wattage', '>=', $minimumWattage)
      ->whereNotNull('certification')
      ->where('certification', '!=', 'Nav')
      ->orderBy('certification', 'desc')
      ->orderBy('wattage', 'asc')
      ->first();
  }

  protected function selectWithoutCertification($budget, $minimumWattage)
  {
    return Psu::whereNotNull('wattage')
      ->whereNotNull('price')
      ->where('price', '<=', $budget)
      ->where('wattage', '>=', $minimumWattage)
      ->orderBy('wattage', 'asc')
      ->first();
  }

  protected function selectAny($budget)
  {
    return Psu::whereNotNull('wattage')
      ->whereNotNull('price')
      ->where('price', '<=', $budget)
      ->orderByDesc('wattage')
      ->first();
  }
}
