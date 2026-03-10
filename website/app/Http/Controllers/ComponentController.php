<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Services\CompatibilityService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ComponentController extends Controller
{
    private const VALID_SORTS = ['price_asc', 'price_desc', 'name_asc', 'name_desc'];

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

            // check if all values are positive integers
            foreach ($decoded as $key => $value) {
                if (! is_int($value) && ! ctype_digit((string) $value)) {
                    return response()->json([
                        'error' => "value for '{$key}' in selected must be a positive integer",
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

    public function show(string $type, int $id): JsonResponse
    {
        if (! array_key_exists($type, CompatibilityService::VALID_TYPES)) {
            return response()->json([
                'error'       => "'{$type}' is not a valid component",
                'valid_types' => array_keys(CompatibilityService::VALID_TYPES),
            ], 400);
        }

        $modelClass = CompatibilityService::VALID_TYPES[$type];
        $component  = $modelClass::find($id);

        if (! $component) {
            return response()->json([
                'error' => "no {$type} found with id {$id}",
            ], 404);
        }

        return response()->json($component);
    }
}
