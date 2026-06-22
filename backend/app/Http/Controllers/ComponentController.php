<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Services\CompatibilityService;
use App\Support\ComponentListingJoin;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ComponentController extends Controller
{
  private const VALID_SORTS = ['price_asc', 'price_desc', 'name_asc', 'name_desc'];

  private const FILTER_COLUMNS = [
    'cpu' => ['socket', 'cores', 'integrated_graphics', 'cooler_included'],
    'motherboard' => ['socket', 'chipset', 'form_factor', 'memory_type', 'wifi'],
    'ram' => ['memory_type', 'capacity', 'frequency'],
    'gpu' => ['vram', 'min_psu'],
    'case' => ['form_factor'],
    'cooler' => ['tdp_support'],
    'psu' => ['wattage', 'efficiency_rating', 'modular', 'psu_type'],
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
      'min_price',
      'max_price',
      'show_in_stock',
      'show_orderable',
      'show_compatible_only',
      // cpu
      'socket',
      'cores',
      'integrated_graphics',
      'cooler_included',
      // motherboard
      'chipset',
      'form_factor',
      'memory_type',
      'wifi',
      // ram
      'capacity',
      'frequency',
      // gpu
      'vram',
      'min_psu',
      // cooler
      'tdp_support',
      // psu
      'wattage',
      'efficiency_rating',
      'modular',
      'psu_type',
      // ssd
      'type',
      'interface',
    ]);

    $paginator = $this->compatibility->getCompatible($type, $selected, $filters);

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
    $component  = $modelClass::where('product_code', $code)->first();

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

    $modelClass = CompatibilityService::VALID_TYPES[$type];
    $columns = self::FILTER_COLUMNS[$type] ?? [];
    $result = [];

    foreach ($columns as $column) {
      $result[$column] = ComponentListingJoin::apply($modelClass::query())
        ->whereNotNull($column)
        ->whereIn('listing_agg.listing_stock_status', ['in_stock', 'orderable'])
        ->whereNotNull('listing_agg.listing_price')
        ->distinct()
        ->orderBy($column)
        ->pluck($column);
    }

    return response()->json($result);
  }
}
