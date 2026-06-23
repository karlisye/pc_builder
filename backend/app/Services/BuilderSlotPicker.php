<?php

namespace App\Services;

use App\Models\{Cpu, Motherboard, Ram, Gpu, Ssd, Hdd, PcCase, Fan, Psu, Cooler};
use App\Services\ComponentScorer;
use App\Support\ComponentListingJoin;
use Illuminate\Database\Eloquent\Model;

class BuilderSlotPicker
{
  public function __construct(
    private readonly ComponentScorer $scorer
  ) {}

  public function pick(string $slot, array $selected, array $preferences, ?float $budget = null): ?Model
  {
    $modelClass = CompatibilityService::VALID_TYPES[$slot];

    $query = ComponentListingJoin::apply($modelClass::query())
      ->with(['listings' => fn($q) => $q->orderBy('price')])
      ->whereNotNull('listing_agg.listing_price');

    $shouldIncludeOrderable = filter_var($preferences['include_orderable'] ?? false, FILTER_VALIDATE_BOOLEAN);

    if ($shouldIncludeOrderable) {
      $query->whereIn('listing_agg.listing_stock_status', ['in_stock', 'orderable']);
    } else {
      $query->where('listing_agg.listing_stock_status', 'in_stock');
    }

    if ($budget !== null) {
      $query->where('listing_agg.listing_price', '<=', $budget);
    }

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

    // preferences
    if (isset($preferences['gpu']) && $slot === 'gpu') {
      $query->where('type', $preferences['gpu']);
    }
    if (isset($preferences['cpu']) && $slot === 'cpu') {
      $query->where('type', $preferences['cpu']);
    }
    if (isset($preferences['integrated_graphics']) && $slot === 'cpu') {
      $query->where('integrated_graphics', true);
    }
    if (isset($preferences['cooler_included']) && $slot === 'cpu') {
      $query->where('cooler_included', true);
    }

    $candidates = $query->get();

    if ($candidates->isEmpty()) {
      return null;
    }

    return $candidates->sortByDesc(fn($item) => $this->scorer->score($slot, $item, $preferences))->first();
  }

  // find cheapest to estimate cheapest build price
  public function cheapest(string $slot, array $selected, array $preferences): ?Model
  {
    $modelClass = CompatibilityService::VALID_TYPES[$slot];

    $query = ComponentListingJoin::apply($modelClass::query())
      ->with(['listings' => fn($q) => $q->orderBy('price')])
      ->whereNotNull('listing_agg.listing_price');

    $shouldIncludeOrderable = filter_var($preferences['include_orderable'] ?? false, FILTER_VALIDATE_BOOLEAN);

    if ($shouldIncludeOrderable) {
      $query->whereIn('listing_agg.listing_stock_status', ['in_stock', 'orderable']);
    } else {
      $query->where('listing_agg.listing_stock_status', 'in_stock');
    }

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

    if (isset($preferences['gpu']) && $slot === 'gpu') {
      $query->where('type', $preferences['gpu']);
    }
    if (isset($preferences['cpu']) && $slot === 'cpu') {
      $query->where('type', $preferences['cpu']);
    }
    if (isset($preferences['integrated_graphics']) && $slot === 'cpu') {
      $query->where('integrated_graphics', true);
    }
    if (isset($preferences['cooler_included']) && $slot === 'cpu') {
      $query->where('cooler_included', true);
    }

    return $query->orderBy('listing_agg.listing_price')->first();
  }
}
