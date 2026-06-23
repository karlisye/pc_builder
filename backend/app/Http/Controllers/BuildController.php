<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Build;
use App\Services\CompatibilityService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BuildController extends Controller
{
  public function publish(Request $request, Build $build): JsonResponse
  {
    if ($build->user_id !== $request->user()->id) {
      return response()->json(['error' => __('messages.not_found')], 404);
    }

    $build->is_public = !$build->is_public;
    $build->save();

    return response()->json([
      'success' => $build->is_public
        ? __('messages.build_now_public')
        : __('messages.build_now_private'),
      'is_public' => $build->is_public,
    ]);
  }

  public function index(Request $request): JsonResponse
  {
    $builds = Build::query()
      ->where('user_id', $request->user()->id)
      ->orderByDesc('created_at')
      ->withCount('likes')
      ->withCount('bookmarks')
      ->get();

    return response()->json($builds);
  }

  public function store(Request $request): JsonResponse
  {
    $validated = $request->validate([
      'build_id' => ['sometimes', 'integer', 'exists:builds,id'],
      'name' => ['required', 'string', 'max:255'],
      'notes' => ['sometimes', 'nullable', 'string', 'max:5000'],
      'type' => ['sometimes', 'nullable', 'string', 'in:gaming,office,rendering,streaming'],
      'components' => ['required', 'array', 'min:1'],
      'components.*' => ['string'],
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

    foreach ($validated['components'] as $type => $productCode) {
      $modelClass = CompatibilityService::VALID_TYPES[$type];
      if (! $modelClass::where('product_code', $productCode)->exists()) {
        return response()->json([
          'error' => "No {$type} found with product_code {$productCode}.",
        ], 404);
      }
    }

    $componentFks = array_fill_keys(array_values($slots), null);
    foreach ($validated['components'] as $type => $productCode) {
      $componentFks[$slots[$type]] = $productCode;
    }

    $totalPrice = $this->calculateTotalPrice($validated['components']);

    // if request comes with a build id update it if belongs to user
    if (isset($validated['build_id'])) {
      $build = Build::where('id', $validated['build_id'])
        ->where('user_id', $request->user()->id)
        ->first();

      if ($build) {
        $build->update([
          'name' => $validated['name'],
          'notes' => $validated['notes'] ?? null,
          'type' => $validated['type'] ?? null,
          'total_price' => $totalPrice,
          ...$componentFks,
        ]);

        return response()->json($build->loadComponents(), 200);
      }
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
      return response()->json(['error' => __('messages.not_found')], 404);
    }

    return response()->json($build->loadComponents()->loadCount('likes')->loadCount('bookmarks')->loadAvg('reviews', 'rating'));
  }

  public function update(Request $request, Build $build): JsonResponse
  {
    if ($request->user() && $build->user_id !== $request->user()->id) {
      return response()->json(['error' => __('messages.not_found')], 404);
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
      return response()->json(['error' => __('messages.not_found')], 404);
    }

    $build->delete();

    return response()->json(['message' => __('messages.build_deleted')]);
  }

  private function calculateTotalPrice(array $components): float
  {
    $total = 0.0;

    foreach ($components as $type => $productCode) {
      $modelClass = CompatibilityService::VALID_TYPES[$type];
      $component  = $modelClass::where('product_code', $productCode)->first();
      if ($component?->price) {
        $total += (float) $component->price;
      }
    }

    return round($total, 2);
  }
}
