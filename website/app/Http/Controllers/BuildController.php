<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Build;
use App\Services\CompatibilityService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class BuildController extends Controller
{
  public function publish(Request $request, Build $build): JsonResponse
  {
    if ($build->user_id !== $request->user()->id) {
      return response()->json(['error' => 'Not found.'], 404);
    }

    $build->is_public = !$build->is_public;
    $build->save();

    return response()->json([
      'success' => $build->is_public
        ? 'Build is now public!'
        : 'Build is now private.',
      'is_public' => $build->is_public,
    ]);
  }

  public function index(Request $request): InertiaResponse
  {
    $builds = Build::query()
      ->where('user_id', $request->user()->id)
      ->orderByDesc('created_at')
      ->get();

    return Inertia::render('SavedBuilds', [
      'builds' => $builds
    ]);
  }

  public function store(Request $request): JsonResponse
  {
    $validated = $request->validate([
      'build_id' => ['sometimes', 'integer', 'exists:builds,id'],
      'name' => ['required', 'string', 'max:255'],
      'notes' => ['sometimes', 'nullable', 'string', 'max:5000'],
      'type' => ['sometimes', 'nullable', 'string', 'in:gaming,office,rendering,streaming'],
      'components' => ['required', 'array', 'min:1'],
      'components.*' => ['integer', 'min:1'],
    ]);

    $slots = Build::componentSlots();

    foreach (array_keys($validated['components']) as $type) {
      if (! array_key_exists($type, $slots)) {
        return response()->json([
          'error' => "'{$type}' is not a valid component slot.",
          'valid_slots' => array_keys($slots),
        ], 400);
      }
    }

    foreach ($validated['components'] as $type => $id) {
      $modelClass = CompatibilityService::VALID_TYPES[$type];
      if (! $modelClass::find($id)) {
        return response()->json([
          'error' => "No {$type} found with ID {$id}.",
        ], 404);
      }
    }

    $componentFks = [];
    foreach ($validated['components'] as $type => $id) {
      $componentFks[$slots[$type]] = $id;
    }

    $totalPrice = $this->calculateTotalPrice($validated['components']);

    if (isset($validated['build_id'])) {
      $build = Build::where('id', $validated['build_id'])
        ->where('user_id', $request->user()?->id)
        ->firstOrFail();

      $build->update([
        'name' => $validated['name'],
        'notes' => $validated['notes'] ?? null,
        'type' => $validated['type'] ?? null,
        'total_price' => $totalPrice,
        ...$componentFks,
      ]);

      return response()->json($build->loadComponents(), 200);
    }

    $build = Build::create([
      'user_id' => $request->user()?->id,
      'name' => $validated['name'],
      'notes' => $validated['notes'] ?? null,
      'type' => $validated['type'] ?? null,
      'total_price' => $totalPrice,
      ...$componentFks,
    ]);

    return response()->json($build->loadComponents(), 201);
  }

  public function show(Request $request, Build $build): JsonResponse
  {
    if ($request->user() && $build->user_id !== $request->user()->id) {
      return response()->json(['error' => 'Not found.'], 404);
    }

    return response()->json($build->loadComponents());
  }

  public function update(Request $request, Build $build): JsonResponse
  {
    if ($request->user() && $build->user_id !== $request->user()->id) {
      return response()->json(['error' => 'Not found.'], 404);
    }

    $validated = $request->validate([
      'name' => ['sometimes', 'string', 'max:255'],
      'notes' => ['sometimes', 'nullable', 'string', 'max:5000'],
    ]);

    $build->update($validated);

    return response()->json($build->loadComponents());
  }

  public function destroy(Request $request, Build $build): JsonResponse
  {
    if ($request->user() && $build->user_id !== $request->user()->id) {
      return response()->json(['error' => 'Not found.'], 404);
    }

    $build->delete();

    return response()->json(['message' => 'Build deleted successfully.']);
  }

  private function calculateTotalPrice(array $components): float
  {
    $total = 0.0;

    foreach ($components as $type => $id) {
      $modelClass = CompatibilityService::VALID_TYPES[$type];
      $component  = $modelClass::find($id);
      if ($component?->price) {
        $total += (float) $component->price;
      }
    }

    return round($total, 2);
  }
}
