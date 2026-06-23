<?php

namespace App\Http\Controllers;

use App\Models\Build;
use App\Models\BuildComment;
use App\Models\BuildCommentLike;
use App\Models\BuildReview;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BuildCommentController extends Controller
{
  public function index(Request $request, Build $build): JsonResponse
  {
    if (!$build->is_public) {
      return response()->json(['error' => __('messages.not_found')], 404);
    }

    $userId = $request->user()?->id;
    $ratings = BuildReview::where('build_id', $build->id)->pluck('rating', 'user_id');

    $comments = BuildComment::where('build_id', $build->id)
      ->whereNull('parent_id')
      ->with('user')
      ->withCount('likes')
      ->withExists(['likes as liked' => fn($q) => $q->where('user_id', $userId)])
      ->with(['replies' => fn($q) => $q
        ->with('user')
        ->withCount('likes')
        ->withExists(['likes as liked' => fn($q2) => $q2->where('user_id', $userId)])])
      ->orderByDesc('created_at')
      ->get()
      ->map(fn($comment) => $this->formatComment($comment, $ratings));

    return response()->json($comments);
  }

  public function store(Request $request, Build $build): JsonResponse
  {
    if (!$build->is_public) {
      return response()->json(['error' => __('messages.not_found')], 404);
    }

    $validated = $request->validate([
      'body' => ['required', 'string', 'max:2000'],
      'parent_id' => ['sometimes', 'nullable', 'integer', 'exists:build_comments,id'],
    ]);

    if (!empty($validated['parent_id'])) {
      $parentExists = BuildComment::where('id', $validated['parent_id'])
        ->where('build_id', $build->id)
        ->exists();

      if (!$parentExists) {
        return response()->json(['error' => __('messages.not_found')], 404);
      }
    }

    $comment = BuildComment::create([
      'user_id' => $request->user()->id,
      'build_id' => $build->id,
      'parent_id' => $validated['parent_id'] ?? null,
      'body' => $validated['body'],
    ]);

    $comment->load('user');

    $rating = BuildReview::where('build_id', $build->id)
      ->where('user_id', $comment->user_id)
      ->value('rating');

    return response()->json([
      'id' => $comment->id,
      'body' => $comment->body,
      'created_at' => $comment->created_at,
      'user' => $comment->user,
      'rating' => $rating,
      'likes_count' => 0,
      'liked' => false,
      'parent_id' => $comment->parent_id,
      'replies' => [],
    ], 201);
  }

  public function like(Request $request, BuildComment $comment): JsonResponse
  {
    $existingLike = BuildCommentLike::where('user_id', $request->user()->id)
      ->where('comment_id', $comment->id)
      ->first();

    if ($existingLike) {
      $existingLike->delete();
      return response()->json(['message' => 'unliked'], 200);
    }

    BuildCommentLike::create([
      'user_id' => $request->user()->id,
      'comment_id' => $comment->id,
    ]);

    return response()->json(['message' => 'liked'], 200);
  }

  public function destroy(Request $request, BuildComment $comment): JsonResponse
  {
    if ($comment->user_id !== $request->user()->id) {
      return response()->json(['error' => __('messages.not_found')], 404);
    }

    $comment->delete();

    return response()->json(['message' => 'deleted']);
  }

  private function formatComment(BuildComment $comment, $ratings): array
  {
    return [
      'id' => $comment->id,
      'body' => $comment->body,
      'created_at' => $comment->created_at,
      'user' => $comment->user,
      'rating' => $ratings[$comment->user_id] ?? null,
      'likes_count' => $comment->likes_count,
      'liked' => $comment->liked,
      'replies' => $comment->replies->map(fn($reply) => [
        'id' => $reply->id,
        'body' => $reply->body,
        'created_at' => $reply->created_at,
        'user' => $reply->user,
        'rating' => $ratings[$reply->user_id] ?? null,
        'likes_count' => $reply->likes_count,
        'liked' => $reply->liked,
      ])->values(),
    ];
  }
}
