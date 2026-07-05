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

    // strict: null values on either side of a compatibility check can't be verified, so the
    // auto-builder must never guess "probably fine" the way manual browsing does
    $query = match ($slot) {
      'cpu' => ComponentFilters::cpu($query, $selected, strict: true),
      'motherboard' => ComponentFilters::motherboard($query, $selected, strict: true),
      'ram' => ComponentFilters::ram($query, $selected, strict: true),
      'gpu' => ComponentFilters::gpu($query, $selected, strict: true),
      'case' => ComponentFilters::case($query, $selected, strict: true),
      'cooler' => ComponentFilters::cooler($query, $selected, strict: true),
      'psu' => ComponentFilters::psu($query, $selected, strict: true),
      default => $query,
    };

    // preferences
    if (isset($preferences['gpu']) && $slot === 'gpu') {
      $query->where('gpu_family', $preferences['gpu']);
    }
    if (isset($preferences['cpu']) && $slot === 'cpu') {
      $query->where('brand', $preferences['cpu']);
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

    return $candidates->sortByDesc(fn($item) => $this->scorer->score($slot, $item, $preferences, $selected))->first();
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

    // strict: null values on either side of a compatibility check can't be verified, so the
    // auto-builder must never guess "probably fine" the way manual browsing does
    $query = match ($slot) {
      'cpu' => ComponentFilters::cpu($query, $selected, strict: true),
      'motherboard' => ComponentFilters::motherboard($query, $selected, strict: true),
      'ram' => ComponentFilters::ram($query, $selected, strict: true),
      'gpu' => ComponentFilters::gpu($query, $selected, strict: true),
      'case' => ComponentFilters::case($query, $selected, strict: true),
      'cooler' => ComponentFilters::cooler($query, $selected, strict: true),
      'psu' => ComponentFilters::psu($query, $selected, strict: true),
      default => $query,
    };

    if (isset($preferences['gpu']) && $slot === 'gpu') {
      $query->where('gpu_family', $preferences['gpu']);
    }
    if (isset($preferences['cpu']) && $slot === 'cpu') {
      $query->where('brand', $preferences['cpu']);
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
