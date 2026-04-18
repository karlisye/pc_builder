<?php

namespace App\Services;

use App\Helpers\CompatibilityHelper;
use App\Models\{Cpu, Motherboard, Ram, Gpu, Ssd, Hdd, PcCase, Fan, Psu, Cooler};
use App\Services\ComponentScorer;
use Illuminate\Database\Eloquent\Model;

class BuilderSlotPicker
{
  public function __construct(
    private readonly ComponentScorer $scorer
  ) {}

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

    return $candidates->sortByDesc(fn($item) => $this->scorer->score($slot, $item))->first();
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

  // find cheapest to estimate cheapest build price
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
}
