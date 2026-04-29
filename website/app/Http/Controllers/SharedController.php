<?php

namespace App\Http\Controllers;

use App\Models\Build;
use App\Models\BuildBookmark;
use App\Models\BuildLike;
use App\Models\BuildReview;
use App\Services\BuildQueryFilter;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class SharedController extends Controller
{
  public function index(): InertiaResponse
  {
    return Inertia::render('Shared');
  }

  public function fetchBuilds(Request $request): JsonResponse
  {
    $query = Build::query()
      ->where('is_public', true);


    // validate filters later

    $filters = $request->only([
      'search',
      'sort'
    ]);

    $query = BuildQueryFilter::apply($query, $filters);

    $userId = $request->user()->id;
    $query->withComponents()
      // get a boolean "liked" for each returned build
      ->withExists(['likes as liked' => fn($q) => $q->where('user_id', $userId)])
      ->withExists(['bookmarks as bookmarked' => fn($q) => $q->where('user_id', $userId)])
      // get "likes_count"
      ->withCount('likes')
      ->withCount('bookmarks')
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

  public function bookmark(Request $request, Build $build): JsonResponse
  {
    $existingBookmark = BuildBookmark::where('user_id', $request->user()->id)
      ->where('build_id', $build->id)
      ->first();

    if ($existingBookmark) {
      $existingBookmark->delete();
      return response()->json(['message' => 'unbookmarked'], 200);
    }

    BuildBookmark::create([
      'user_id' => $request->user()->id,
      'build_id' => $build->id
    ]);

    return response()->json(['message' => 'bookmarked'], 200);
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
