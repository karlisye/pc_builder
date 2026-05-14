<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Build;
use App\Services\BuilderService;
use App\Services\CompatibilityService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class BuilderController extends Controller
{
  public function __construct(
    private readonly BuilderService $builder,
    private readonly CompatibilityService $compatibility,
  ) {}

  public function index(Request $request): InertiaResponse
  {
    $build = null;

    if ($request->has('build')) {
      $query = Build::where('id', $request->query('build'))
        ->with(['cpu', 'motherboard', 'ram', 'gpu', 'ssd', 'hdd', 'pcCase', 'cooler', 'psu', 'fan']);

      // if request is sent with a shared tag, check if build is public, else check if build belongs to user
      if ($request->boolean('shared')) {
        $query->where('is_public', true);
      } else {
        $query->where('user_id', $request->user()->id);
      }

      $build = $query->first();
    }

    return Inertia::render('Builder', [
      'build' => $build,
    ]);
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
