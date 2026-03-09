<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Services\BuilderService;
use App\Services\CompatibilityService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BuilderController extends Controller
{
  public function __construct(
    private readonly BuilderService $builder,
    private readonly CompatibilityService $compatibility,
  ) {}

  public function generate(Request $request): JsonResponse
  {
    $validated = $request->validate([
      'selected' => ['sometimes', 'array'],
      'selected.*' => ['integer', 'min:1'],
      'budget'   => ['sometimes', 'nullable', 'numeric', 'min:1'],
    ]);

    $selectedIds = $validated['selected'] ?? [];
    $budget = isset($validated['budget']) ? (float) $validated['budget'] : null;

    foreach (array_keys($selectedIds) as $type) {
      if (! array_key_exists($type, CompatibilityService::VALID_TYPES)) {
        return response()->json([
          'error' => "'{$type}' is not a valid component type - valid types are: "
            . implode(', ', array_keys(CompatibilityService::VALID_TYPES)) . '.',
        ], 400);
      }
    }

    try {
      $selected = $this->compatibility->resolveSelected($selectedIds);
    } catch (\InvalidArgumentException $e) {
      return response()->json(['error' => $e->getMessage()], 400);
    }

    // removes all selected that are null
    $selected = array_filter($selected);

    $result = $this->builder->generate($selected, $budget);

    $statusCode = $result['success'] ? 200 : 400;

    return response()->json($result, $statusCode);
  }
}
