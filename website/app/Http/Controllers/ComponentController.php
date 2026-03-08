<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Services\CompatibilityService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ComponentController extends Controller
{
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

        $paginator = $this->compatibility->getCompatible($type, $selected);

        return response()->json($paginator);
    }
}
