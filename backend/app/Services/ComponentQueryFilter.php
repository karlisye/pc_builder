<?php

namespace App\Services;

use App\Support\ComponentListingJoin;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Log;

class ComponentQueryFilter
{
  public static function apply(Builder $query, string $type, array $filters, array $compatibleIds): Builder
  {
    $query = ComponentListingJoin::apply($query);
    $query = self::applyGlobal($query, $filters, $compatibleIds);
    $query = self::applyPerType($query, $type, $filters);
    $query = self::applySort($query, $filters['sort'] ?? null, $compatibleIds);

    return $query;
  }

  private static function applyGlobal(Builder $query, array $filters, array $compatibleIds): Builder
  {
    // compatibility and stock filters
    $showInStock = filter_var($filters['show_in_stock'] ?? true, FILTER_VALIDATE_BOOLEAN);
    $showOrderable = filter_var($filters['show_orderable'] ?? true, FILTER_VALIDATE_BOOLEAN);
    $showCompatibleOnly = filter_var($filters['show_compatible_only'] ?? false, FILTER_VALIDATE_BOOLEAN);
    $stockStatuses = [];

    if ($showInStock) {
      $stockStatuses[] = 'in_stock';
    }
    if ($showOrderable) {
      $stockStatuses[] = 'orderable';
    }

    if (!empty($stockStatuses)) {
      $query->whereIn('listing_agg.listing_stock_status', $stockStatuses)
        ->whereNotNull('listing_agg.listing_price');
    } else {
      $query->where('listing_agg.listing_stock_status', 'out_of_stock');
    }

    if ($showCompatibleOnly) {
      if (!empty($compatibleIds)) {
        $query->whereIn('id', $compatibleIds);
      } else {
        $query->whereRaw('1 = 0');
      }
    }

    // search by name
    if (! empty($filters['search'])) {
      $searchTerms = array_filter(explode(' ', $filters['search']));

      $query->where(function ($query) use ($searchTerms) {
        foreach ($searchTerms as $term) {
          $query->where('name', 'like', '%' . $term . '%');
        }
      });
    }

    // price range
    if (isset($filters['min_price']) && is_numeric($filters['min_price'])) {
      $query->where('listing_agg.listing_price', '>=', (float) $filters['min_price']);
    }

    if (isset($filters['max_price']) && is_numeric($filters['max_price'])) {
      $query->where('listing_agg.listing_price', '<=', (float) $filters['max_price']);
    }

    return $query;
  }

  private static function applyPerType(Builder $query, string $type, array $filters): Builder
  {
    return match ($type) {
      'cpu' => self::cpu($query, $filters),
      'motherboard' => self::motherboard($query, $filters),
      'ram' => self::ram($query, $filters),
      'gpu' => self::gpu($query, $filters),
      'case'  => self::pcCase($query, $filters),
      'cooler' => self::cooler($query, $filters),
      'psu' => self::psu($query, $filters),
      'ssd' => self::ssd($query, $filters),
      default => $query,
    };
  }

  private static function cpu(Builder $query, array $f): Builder
  {
    if (! empty($f['socket']))
      $query->where('socket', $f['socket']);

    if (isset($f['cores']) && is_numeric($f['cores']))
      $query->where('cores', (int) $f['cores']);

    if (isset($f['integrated_graphics']) && $f['integrated_graphics'] !== '')
      $query->where('integrated_graphics', filter_var($f['integrated_graphics'], FILTER_VALIDATE_BOOLEAN));

    if (isset($f['cooler_included']) && $f['cooler_included'] !== '')
      $query->where('cooler_included', filter_var($f['cooler_included'], FILTER_VALIDATE_BOOLEAN));

    return $query;
  }

  private static function motherboard(Builder $query, array $f): Builder
  {
    if (! empty($f['socket']))
      $query->where('socket', $f['socket']);

    if (! empty($f['chipset']))
      $query->where('chipset', $f['chipset']);

    if (! empty($f['form_factor']))
      $query->where('form_factor', $f['form_factor']);

    if (! empty($f['memory_type']))
      $query->where('memory_type', $f['memory_type']);

    if (isset($f['wifi']) && $f['wifi'] !== '')
      $query->where('wifi', filter_var($f['wifi'], FILTER_VALIDATE_BOOLEAN));

    return $query;
  }

  private static function ram(Builder $query, array $f): Builder
  {
    if (! empty($f['memory_type']))
      $query->where('memory_type', $f['memory_type']);

    if (isset($f['capacity']) && is_numeric($f['capacity']))
      $query->where('capacity', (int) $f['capacity']);

    if (isset($f['frequency']) && is_numeric($f['frequency']))
      $query->where('frequency', (int) $f['frequency']);

    return $query;
  }

  private static function gpu(Builder $query, array $f): Builder
  {
    if (isset($f['vram']) && is_numeric($f['vram']))
      $query->where('vram', (int) $f['vram']);

    if (isset($f['min_psu']) && is_numeric($f['min_psu']))
      $query->where('min_psu', '<=', (int) $f['min_psu']);

    return $query;
  }

  private static function pcCase(Builder $query, array $f): Builder
  {
    if (! empty($f['form_factor']))
      $query->where('form_factor', $f['form_factor']);

    return $query;
  }

  private static function cooler(Builder $query, array $f): Builder
  {
    if (isset($f['tdp_support']) && is_numeric($f['tdp_support']))
      $query->where('tdp_support', '>=', (int) $f['tdp_support']);

    return $query;
  }

  private static function psu(Builder $query, array $f): Builder
  {
    if (isset($f['wattage']) && is_numeric($f['wattage']))
      $query->where('wattage', '>=', (int) $f['wattage']);

    if (! empty($f['efficiency_rating']))
      $query->where('efficiency_rating', $f['efficiency_rating']);

    if (isset($f['modular']) && $f['modular'] !== '')
      $query->where('modular', filter_var($f['modular'], FILTER_VALIDATE_BOOLEAN));

    if (! empty($f['psu_type']))
      $query->where('psu_type', $f['psu_type']);

    return $query;
  }

  private static function ssd(Builder $query, array $f): Builder
  {
    if (isset($f['capacity']) && is_numeric($f['capacity']))
      $query->where('capacity', (int) $f['capacity']);

    if (! empty($f['type']))
      $query->where('type', $f['type']);

    if (! empty($f['form_factor']))
      $query->where('form_factor', $f['form_factor']);

    if (! empty($f['interface']))
      $query->where('interface', $f['interface']);

    return $query;
  }

  private static function applySort(Builder $query, ?string $sort, array $compatibleIds = []): Builder
  {
    // display compatible first
    if (!empty($compatibleIds)) {
      $placeholders = implode(',', array_fill(0, count($compatibleIds), '?'));

      $query->orderByRaw(
        "CASE WHEN id IN ($placeholders) THEN 0 ELSE 1 END",
        $compatibleIds
      );
    }

    return match ($sort) {
      'price_asc' => $query->orderBy('listing_agg.listing_price'),
      'price_desc' => $query->orderByDesc('listing_agg.listing_price'),
      'name_asc' => $query->orderBy('name'),
      'name_desc' => $query->orderByDesc('name'),
      default => $query->orderBy('listing_agg.listing_price'),
    };
  }
}
