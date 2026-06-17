<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Build;
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

  public function index(Request $request): JsonResponse
  {
    $build = null;

    if ($request->has('build')) {
      $query = Build::where('id', $request->query('build'))
        ->with(['cpu', 'motherboard', 'ram', 'gpu', 'ssd', 'hdd', 'pcCase', 'cooler', 'psu', 'fan']);

      if ($request->boolean('shared')) {
        $query->where('is_public', true);
      } else {
        $query->where('user_id', $request->user()->id);
      }

      $build = $query->first();
    }

    return response()->json(['build' => $build]);
  }

  public function generateComp(Request $request, string $type): JsonResponse
  {
    $validated = $request->validate([
      'selected' => ['sometimes', 'array'],
      'selected.*' => ['integer', 'min:1'],
      'budget' => ['sometimes', 'nullable', 'numeric', 'min:1'],
      'preferences' => ['sometimes', 'array'],
    ]);

    // check if type exists from get request
    if (! array_key_exists($type, CompatibilityService::VALID_TYPES)) {
      return response()->json([
        'error' => "'{$type}' is not a valid component type",
        'valid_types' => array_keys(CompatibilityService::VALID_TYPES),
      ], 400);
    }

    $selectedIds = $validated['selected'] ?? [];
    $budget = isset($validated['budget']) ? (float) $validated['budget'] : null;

    try {
      $selected = $this->compatibility->resolveSelected($selectedIds);
    } catch (\InvalidArgumentException $e) {
      return response()->json(['error' => $e->getMessage()], 400);
    }

    $selected = array_filter($selected);
    $preferences = array_filter($validated['preferences']);
    $slotToFill = $type;

    $result = $this->builder->generate($selected, $budget, $preferences, $slotToFill);


    return response()->json($result);
  }

  public function generate(Request $request): JsonResponse
  {
    $validated = $request->validate([
      'selected' => ['sometimes', 'array'],
      'selected.*' => ['integer', 'min:1'],
      'budget' => ['sometimes', 'nullable', 'numeric', 'min:1'],
      'preferences' => ['sometimes', 'array'],
    ]);

    $selectedIds = $validated['selected'] ?? [];
    $budget = isset($validated['budget']) ? (float) $validated['budget'] : null;

    // check if all selected values are valid ('cpu', 'gpu', etc.)
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

    // removes all selected and preferences that are null
    $selected = array_filter($selected);
    $preferences = array_filter($validated['preferences']);

    // validate pre-selected components are compatible with each other
    $issues = $this->compatibility->validateBuild($selected);
    if (!empty($issues)) {
      return response()->json([
        'success' => false,
        'error' => 'Pre-selected components are incompatible: '
          . implode('. ', array_merge(...array_values($issues))),
        'build' => null,
        'total_price' => null,
        'remaining_budget' => null,
        'attempts_needed' => null,
        'estimated_minimum_budget' => null,
        'warnings' => [],
      ], 400);
    }

    $result = $this->builder->generate($selected, $budget, $preferences);

    if (isset($preferences['type'])) {
      $result['type'] = $preferences['type'];
    }

    $statusCode = $result['success'] ? 200 : 400;

    return response()->json($result, $statusCode);
  }

  public function validate(Request $request): JsonResponse
  {
    $selectedIds = $request->input('selected', []);

    try {
      $selected = $this->compatibility->resolveSelected($selectedIds);
    } catch (\InvalidArgumentException $e) {
      return response()->json(['error' => $e->getMessage()], 400);
    }

    $issues = $this->compatibility->validateBuild($selected);

    return response()->json(['issues' => $issues]);
  }
}
