<?php

namespace App\Http\Controllers;

use App\Models\Build;
use App\Models\BuildLike;
use App\Models\BuildReview;
use App\Services\BuildQueryFilter;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SharedController extends Controller
{
  private const VALID_SORTS = ['price_asc', 'price_desc', 'date_asc', 'date_desc', 'likes_asc', 'likes_desc', 'rating_asc', 'rating_desc'];

  public function fetchBuilds(Request $request): JsonResponse
  {
    $query = Build::query()
      ->where('is_public', true);


    // validate sort
    $sort = $request->query('sort');
    if ($sort && ! in_array($sort, self::VALID_SORTS, true)) {
      return response()->json([
        'error' => "'{$sort}' is not a sort option",
      ], 400);
    }

    // validate show
    $show = $request->query('show');
    if ($show && ! in_array($show, ['liked', 'personal'], true)) {
      return response()->json([
        'error' => "'{$show}' is not a show option",
      ], 400);
    }

    // validate type
    $type = $request->query('type');
    if ($type && ! in_array($type, ['gaming', 'office', 'rendering', 'streaming'], true)) {
      return response()->json([
        'error' => "'{$type}' is not a type option",
      ], 400);
    }

    // validate cpu/gpu preferences
    $gpu_pref = $request->query('gpu_pref');
    if ($gpu_pref && ! in_array($gpu_pref, ['nvidia', 'amd', 'intel'], true)) {
      return response()->json([
        'error' => "'{$gpu_pref}' is not a GPU preference option",
      ], 400);
    }
    $cpu_pref = $request->query('cpu_pref');
    if ($cpu_pref && ! in_array($cpu_pref, ['amd', 'intel'], true)) {
      return response()->json([
        'error' => "'{$cpu_pref}' is not a CPU preference option",
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
      'search',
      'sort',
      'min_price',
      'max_price',
      'show',
      'rating',
      'type',
      'gpu_pref',
      'cpu_pref',
    ]);

    $query = BuildQueryFilter::apply($query, $filters);

    $userId = $request->user()->id;
    $query->withComponents()
      // get a boolean "liked" for each returned build
      ->withExists(['likes as liked' => fn($q) => $q->where('user_id', $userId)])
      // get "likes_count"
      ->withCount('likes')
      ->with(['reviews' => fn($q) => $q->where('user_id', $userId)])
      ->withAvg('reviews', 'rating')
      ->with('user')
      ->paginate(6);

    $paginator = $query->paginate(6);

    return response()->json($paginator);
  }

  public function like(Request $request, Build $build): JsonResponse
  {
    $existingLike = BuildLike::where('user_id', $request->user()->id)
      ->where('build_id', $build->id)
      ->first();

    if ($existingLike) {
      $existingLike->delete();
      return response()->json(['message' => 'unliked'], 200);
    }

    BuildLike::create([
      'user_id' => $request->user()->id,
      'build_id' => $build->id
    ]);

    return response()->json(['message' => 'liked'], 200);
  }

  public function review(Request $request, Build $build): JsonResponse
  {
    $request->validate(['rating' => 'required|integer|min:1|max:5']);

    $review = BuildReview::updateOrCreate(
      ['user_id' => $request->user()->id, 'build_id' => $build->id],
      ['rating' => $request->rating]
    );

    return response()->json($review, 200);
  }
}
