<?php

namespace App\Services;

use App\Support\ComponentListingJoin;
use Illuminate\Database\Eloquent\Builder;

class ComponentQueryFilter
{
  public static function apply(Builder $query, string $type, array $filters, array $compatibleIds): Builder
  {
    $query = ComponentListingJoin::apply($query);
    $query = self::applyGlobal($query, $filters, $compatibleIds);
    $query = self::applyPerType($query, $type, $filters);
    $query = self::applySort($query, $type, $filters['sort'] ?? null, $compatibleIds);

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

    // brand filter
    if (! empty($filters['brand'])) {
      $query->where('brand', $filters['brand']);
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
      'hdd' => self::hdd($query, $filters),
      'fan' => self::fan($query, $filters),
      default => $query,
    };
  }

  private static function cpu(Builder $query, array $f): Builder
  {
    if (! empty($f['socket']))
      $query->where('socket', $f['socket']);

    if (! empty($f['memory_type']))
      $query->where(function (Builder $q) use ($f) {
        $q->where('memory_type', $f['memory_type'])
          ->orWhere('memory_type', 'DDR4/DDR5');
      });

    if (isset($f['cores_min']) && is_numeric($f['cores_min']))
      $query->where('cores', '>=', (int) $f['cores_min']);
    if (isset($f['cores_max']) && is_numeric($f['cores_max']))
      $query->where('cores', '<=', (int) $f['cores_max']);

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

    if (isset($f['modules_count']) && is_numeric($f['modules_count']))
      $query->where('modules_count', (int) $f['modules_count']);

    if (isset($f['capacity_min']) && is_numeric($f['capacity_min']))
      $query->where('capacity', '>=', (int) $f['capacity_min']);
    if (isset($f['capacity_max']) && is_numeric($f['capacity_max']))
      $query->where('capacity', '<=', (int) $f['capacity_max']);

    if (isset($f['frequency']) && is_numeric($f['frequency']))
      $query->where('frequency', (int) $f['frequency']);

    if (isset($f['xmp']) && $f['xmp'] !== '')
      $query->where('xmp', filter_var($f['xmp'], FILTER_VALIDATE_BOOLEAN));

    return $query;
  }

  private static function gpu(Builder $query, array $f): Builder
  {
    if (! empty($f['gpu_family']))
      $query->where('gpu_family', $f['gpu_family']);

    if (isset($f['vram_min']) && is_numeric($f['vram_min']))
      $query->where('vram', '>=', (int) $f['vram_min']);
    if (isset($f['vram_max']) && is_numeric($f['vram_max']))
      $query->where('vram', '<=', (int) $f['vram_max']);

    if (isset($f['min_psu_min']) && is_numeric($f['min_psu_min']))
      $query->where('min_psu', '>=', (int) $f['min_psu_min']);
    if (isset($f['min_psu_max']) && is_numeric($f['min_psu_max']))
      $query->where('min_psu', '<=', (int) $f['min_psu_max']);

    return $query;
  }

  private static function pcCase(Builder $query, array $f): Builder
  {
    if (! empty($f['form_factor']))
      $query->where('form_factor', $f['form_factor']);

    if (isset($f['psu_included']) && $f['psu_included'] !== '')
      $query->where('psu_included', filter_var($f['psu_included'], FILTER_VALIDATE_BOOLEAN));

    return $query;
  }

  private static function cooler(Builder $query, array $f): Builder
  {
    if (isset($f['tdp_support_min']) && is_numeric($f['tdp_support_min']))
      $query->where('tdp_support', '>=', (int) $f['tdp_support_min']);
    if (isset($f['tdp_support_max']) && is_numeric($f['tdp_support_max']))
      $query->where('tdp_support', '<=', (int) $f['tdp_support_max']);

    if (isset($f['fan_size_mm_min']) && is_numeric($f['fan_size_mm_min']))
      $query->where('fan_size_mm', '>=', (int) $f['fan_size_mm_min']);
    if (isset($f['fan_size_mm_max']) && is_numeric($f['fan_size_mm_max']))
      $query->where('fan_size_mm', '<=', (int) $f['fan_size_mm_max']);

    return $query;
  }

  private static function hdd(Builder $query, array $f): Builder
  {
    if (isset($f['capacity_min']) && is_numeric($f['capacity_min']))
      $query->where('capacity', '>=', (int) $f['capacity_min']);
    if (isset($f['capacity_max']) && is_numeric($f['capacity_max']))
      $query->where('capacity', '<=', (int) $f['capacity_max']);

    if (! empty($f['interface']))
      $query->where('interface', $f['interface']);

    return $query;
  }

  private static function fan(Builder $query, array $f): Builder
  {
    if (isset($f['size_mm_min']) && is_numeric($f['size_mm_min']))
      $query->where('size_mm', '>=', (int) $f['size_mm_min']);
    if (isset($f['size_mm_max']) && is_numeric($f['size_mm_max']))
      $query->where('size_mm', '<=', (int) $f['size_mm_max']);

    if (isset($f['units_in_package']) && is_numeric($f['units_in_package']))
      $query->where('units_in_package', (int) $f['units_in_package']);

    return $query;
  }

  private static function psu(Builder $query, array $f): Builder
  {
    if (isset($f['wattage_min']) && is_numeric($f['wattage_min']))
      $query->where('wattage', '>=', (int) $f['wattage_min']);
    if (isset($f['wattage_max']) && is_numeric($f['wattage_max']))
      $query->where('wattage', '<=', (int) $f['wattage_max']);

    if (! empty($f['efficiency_rating']))
      $query->where('efficiency_rating', $f['efficiency_rating']);

    if (! empty($f['modular']))
      $query->where('modular', $f['modular']);

    if (! empty($f['psu_type']))
      $query->where('psu_type', $f['psu_type']);

    if (isset($f['pcie_5']) && $f['pcie_5'] !== '')
      $query->where('pcie_5', filter_var($f['pcie_5'], FILTER_VALIDATE_BOOLEAN));

    return $query;
  }

  private static function ssd(Builder $query, array $f): Builder
  {
    if (isset($f['capacity_min']) && is_numeric($f['capacity_min']))
      $query->where('capacity', '>=', (int) $f['capacity_min']);
    if (isset($f['capacity_max']) && is_numeric($f['capacity_max']))
      $query->where('capacity', '<=', (int) $f['capacity_max']);

    if (! empty($f['type']))
      $query->where('type', $f['type']);

    if (! empty($f['form_factor']))
      $query->where('form_factor', $f['form_factor']);

    if (! empty($f['interface']))
      $query->where('interface', $f['interface']);

    return $query;
  }

  private static function applySort(Builder $query, string $type, ?string $sort, array $compatibleIds = []): Builder
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
      default => self::defaultSort($query, $type),
    };
  }

  private static function defaultSort(Builder $query, string $type): Builder
  {
    return $query->orderBy('ean');
  }
}
