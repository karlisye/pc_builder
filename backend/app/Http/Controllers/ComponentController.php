<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Services\CompatibilityService;
use App\Support\ComponentListingJoin;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class ComponentController extends Controller
{
  private const VALID_SORTS = ['price_asc', 'price_desc', 'name_asc', 'name_desc'];

  private const FILTER_COLUMNS = [
    'cpu' => ['socket', 'memory_type', 'cores', 'integrated_graphics', 'cooler_included'],
    'motherboard' => ['socket', 'chipset', 'form_factor', 'memory_type', 'wifi'],
    'ram' => ['memory_type', 'modules_count', 'capacity', 'frequency', 'xmp'],
    'gpu' => ['gpu_family', 'vram', 'min_psu'],
    'case' => ['form_factor', 'psu_included'],
    'cooler' => ['tdp_support', 'fan_size_mm'],
    'hdd' => ['capacity', 'interface'],
    'fan' => ['size_mm', 'units_in_package'],
    'psu' => ['wattage', 'efficiency_rating', 'modular', 'psu_type', 'pcie_5'],
    'ssd' => ['capacity', 'type', 'form_factor', 'interface'],
  ];

  public function __construct(
    private readonly CompatibilityService $compatibility
  ) {}

  public function index(Request $request, string $type): JsonResponse
  {
    // check if type exists from get request
    if (! array_key_exists($type, CompatibilityService::VALID_TYPES)) {
      return response()->json([
        'error' => "'{$type}' is not a valid component type",
        'valid_types' => array_keys(CompatibilityService::VALID_TYPES),
      ], 400);
    }

    $selectedIds = [];

    if ($request->filled('selected')) {
      $decoded = json_decode($request->query('selected'), true);

      // check if all values are non-empty product codes
      foreach ($decoded as $key => $value) {
        if (! is_string($value) || $value === '') {
          return response()->json([
            'error' => "value for '{$key}' in selected must be a product code string",
          ], 400);
        }
      }

      $selectedIds = $decoded;
    }

    try {
      $selected = $this->compatibility->resolveSelected($selectedIds);
    } catch (\InvalidArgumentException $e) {
      return response()->json(['error' => $e->getMessage()], 400);
    }

    // validate sort
    $sort = $request->query('sort');
    if ($sort && ! in_array($sort, self::VALID_SORTS, true)) {
      return response()->json([
        'error' => "'{$sort}' is not a sort option",
        'valid_sorts' => self::VALID_SORTS,
      ], 400);
    }

    // validate price range
    if ($request->filled('min_price') && ! is_numeric($request->query('min_price'))) {
      return response()->json(['error' => '`min_price` must be a number'], 400);
    }

    if ($request->filled('max_price') && ! is_numeric($request->query('max_price'))) {
      return response()->json(['error' => '`max_price` must be a number'], 400);
    }

    $filters = $request->only([
      // global
      'sort',
      'search',
      'brand',
      'min_price',
      'max_price',
      'show_in_stock',
      'show_orderable',
      'show_compatible_only',
      // cpu
      'socket',
      'memory_type',
      'cores_min',
      'cores_max',
      'integrated_graphics',
      'cooler_included',
      // motherboard
      'chipset',
      'form_factor',
      'wifi',
      // ram
      'modules_count',
      'capacity_min',
      'capacity_max',
      'frequency_min',
      'frequency_max',
      'xmp',
      // gpu
      'gpu_family',
      'vram_min',
      'vram_max',
      'min_psu_min',
      'min_psu_max',
      // cooler
      'tdp_support_min',
      'tdp_support_max',
      'fan_size_mm_min',
      'fan_size_mm_max',
      // psu
      'wattage_min',
      'wattage_max',
      'efficiency_rating',
      'modular',
      'psu_type',
      'pcie_5',
      // ssd
      'type',
      'interface',
      // hdd (interface shared with ssd)
      // fan
      'size_mm_min',
      'size_mm_max',
      'units_in_package',
      // case
      'psu_included',
    ]);

    $cacheKey = "components:{$type}:list:" . md5(json_encode([$selected, $filters, $request->query('page', 1)]));

    $paginator = Cache::remember($cacheKey, now()->addMinutes(15), function () use ($type, $selected, $filters) {
      return $this->compatibility->getCompatible($type, $selected, $filters);
    });

    return response()->json($paginator);
  }

  public function show(string $type, string $code): JsonResponse
  {
    if (! array_key_exists($type, CompatibilityService::VALID_TYPES)) {
      return response()->json([
        'error' => "'{$type}' is not a valid component",
        'valid_types' => array_keys(CompatibilityService::VALID_TYPES),
      ], 400);
    }

    $modelClass = CompatibilityService::VALID_TYPES[$type];
    $component  = $modelClass::where('product_code', $code)
      ->with(['listings' => fn($q) => $q->orderBy('price')])
      ->first();

    if (! $component) {
      return response()->json([
        'error' => "no {$type} found with product_code {$code}",
      ], 404);
    }

    return response()->json($component);
  }

  public function filters(string $type): JsonResponse
  {
    if (! array_key_exists($type, CompatibilityService::VALID_TYPES)) {
      return response()->json([
        'error' => "'{$type}' is not a valid component",
        'valid_types' => array_keys(CompatibilityService::VALID_TYPES),
      ], 400);
    }

    $result = Cache::remember("components:{$type}:filters", now()->addHours(6), function () use ($type) {
      $modelClass = CompatibilityService::VALID_TYPES[$type];
      $columns = self::FILTER_COLUMNS[$type] ?? [];
      $result = [];

      // DDR4/DDR5 compound value is excluded from filter options (it's an internal
      // value meaning the CPU supports both; the filter handles it inclusively)
      $excludeValues = ['cpu' => ['memory_type' => ['DDR4/DDR5']]];

      foreach ($columns as $column) {
        $values = ComponentListingJoin::apply($modelClass::query())
          ->whereNotNull($column)
          ->whereIn('listing_agg.listing_stock_status', ['in_stock', 'orderable'])
          ->whereNotNull('listing_agg.listing_price')
          ->select($column)
          ->distinct()
          ->orderBy($column)
          ->toBase()
          ->pluck($column);

        $exclude = $excludeValues[$type][$column] ?? [];
        $result[$column] = $exclude
          ? $values->filter(fn($v) => !in_array($v, $exclude, true))->values()
          : $values;
      }

      // brand is global across all types
      $result['brand'] = ComponentListingJoin::apply($modelClass::query())
        ->whereNotNull('brand')
        ->whereIn('listing_agg.listing_stock_status', ['in_stock', 'orderable'])
        ->whereNotNull('listing_agg.listing_price')
        ->select('brand')
        ->distinct()
        ->orderBy('brand')
        ->toBase()
        ->pluck('brand');

      // price bounds for the range slider
      $priceAgg = ComponentListingJoin::apply($modelClass::query())
        ->whereIn('listing_agg.listing_stock_status', ['in_stock', 'orderable'])
        ->whereNotNull('listing_agg.listing_price')
        ->select(\Illuminate\Support\Facades\DB::raw('FLOOR(MIN(listing_agg.listing_price)) as price_min, CEIL(MAX(listing_agg.listing_price)) as price_max'))
        ->toBase()
        ->first();

      $result['price_min'] = (int) ($priceAgg->price_min ?? 0);
      $result['price_max'] = (int) ($priceAgg->price_max ?? 9999);

      return $result;
    });

    return response()->json($result);
  }
}
