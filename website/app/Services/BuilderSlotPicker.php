<?php

namespace App\Services;

use App\Helpers\CompatibilityHelper;
use App\Models\{Cpu, Motherboard, Ram, Gpu, Ssd, Hdd, PcCase, Fan, Psu, Cooler};
use Illuminate\Database\Eloquent\Model;

class BuilderSlotPicker
{
  public function pick(string $slot, float $budget, array $selected): ?Model
  {
    $modelClass = CompatibilityService::VALID_TYPES[$slot];

    $query = $modelClass::query()
      ->whereNotNull('price')
      ->where('in_stock', true)
      ->where('price', '<=', $budget);

    $query = match ($slot) {
      'cpu' => ComponentFilters::cpu($query, $selected),
      'motherboard' => ComponentFilters::motherboard($query, $selected),
      'ram' => ComponentFilters::ram($query, $selected),
      'gpu' => ComponentFilters::gpu($query, $selected),
      'case' => ComponentFilters::case($query, $selected),
      'cooler' => ComponentFilters::cooler($query, $selected),
      'psu' => ComponentFilters::psu($query, $selected),
      default => $query,
    };

    $candidates = $query->get();

    if ($candidates->isEmpty()) {
      return null;
    }

    return $candidates->sortByDesc(fn($item) => $this->score($slot, $item))->first();
  }

  public function pickMostExpensive(string $slot, array $selected): ?Model
  {
    $modelClass = CompatibilityService::VALID_TYPES[$slot];

    $query = $modelClass::query()
      ->whereNotNull('price')
      ->where('in_stock', true);

    $query = match ($slot) {
      'cpu' => ComponentFilters::cpu($query, $selected),
      'motherboard' => ComponentFilters::motherboard($query, $selected),
      'ram' => ComponentFilters::ram($query, $selected),
      'gpu' => ComponentFilters::gpu($query, $selected),
      'case' => ComponentFilters::case($query, $selected),
      'cooler' => ComponentFilters::cooler($query, $selected),
      'psu' => ComponentFilters::psu($query, $selected),
      default => $query,
    };

    return $query->orderByDesc('price')->first();
  }

  public function cheapest(string $slot, array $selected): ?Model
  {
    $modelClass = CompatibilityService::VALID_TYPES[$slot];

    $query = $modelClass::query()
      ->whereNotNull('price')
      ->where('in_stock', true);

    $query = match ($slot) {
      'cpu' => ComponentFilters::cpu($query, $selected),
      'motherboard' => ComponentFilters::motherboard($query, $selected),
      'ram' => ComponentFilters::ram($query, $selected),
      'gpu' => ComponentFilters::gpu($query, $selected),
      'case' => ComponentFilters::case($query, $selected),
      'cooler' => ComponentFilters::cooler($query, $selected),
      'psu' => ComponentFilters::psu($query, $selected),
      default => $query,
    };

    return $query->orderBy('price')->first();
  }

  public function score(string $slot, Model $item): float
  {
    return match ($slot) {
      'cpu' => $this->scoreCpu($item),
      'gpu' => (float) ($item->vram ?? 0) + (float) ($item->tdp ?? 0),
      'ram' => (float) ($item->frequency ?? 0) + (float) ($item->capacity ?? 0),
      'ssd' => (float) ($item->read_speed ?? 0) + (float) ($item->write_speed ?? 0),
      default  => (float) ($item->price ?? 0),
    };
  }

  private function scoreCpu(Model $item): float
  {
    $passmark = (float) ($item->passmark ?? 0);
    $cores = (float) ($item->cores ?? 2);
    $tdp = (float) ($item->tdp ?? 0);
    $clockRate = (float) ($item->clock_rate ?? 0);

    // base scoring from PassMark (6500-175500)
    $score = $passmark;

    // efficiency per watt (around 3000 pts)
    if ($tdp > 0) {
      $efficienyRatio = $passmark / $tdp;
      $score += $efficienyRatio * 10;
    }

    // clock speed bonus (50-250)
    if ($clockRate > 0) {
      $score += $clockRate * 50;
    }

    // core count bonus (100-500)
    $score += log($cores) * 100;

    return $score;
  }
}
