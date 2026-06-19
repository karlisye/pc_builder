<?php

namespace App\Http\Controllers;

use App\Models\Build;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class UserController extends Controller
{
  public function show(Request $request, User $user): JsonResponse
  {
    $builds = Build::query()
      ->where('user_id', $user->id)
      ->withCount('likes')
      ->withCount('bookmarks')
      ->withAvg('reviews', 'rating')
      ->where('is_public', true)
      ->paginate(4);

    return response()->json([
      'user' => $user,
      'buildData' => $builds,
      'totalLikes' => $user->totalLikes(),
      'totalBookmarks' => $user->totalBookmarks(),
      'avgRating' => $user->averageRating(),
    ]);
  }

  public function index(Request $request): JsonResponse
  {
    $user = $request->user();

    $buildQuery = fn() => Build::query()
      ->where('user_id', $user->id)
      ->withCount('likes')
      ->withCount('bookmarks')
      ->withAvg('reviews', 'rating');

    return response()->json([
      'user' => $user,
      'privateBuildData' => $buildQuery()->where('is_public', false)->paginate(2, ['*'], 'privatePage'),
      'publicBuildData' => $buildQuery()->where('is_public', true)->paginate(2, ['*'], 'publicPage'),
    ]);
  }

  public function indexBookmarked(Request $request): JsonResponse
  {
    $user = $request->user();

    $bookmarkedBuilds = Build::query()
      ->whereHas('bookmarks', fn($q) => $q->where('user_id', $user->id))
      ->withExists(['likes as liked' => fn($q) => $q->where('user_id', $user->id)])
      ->withExists(['bookmarks as bookmarked' => fn($q) => $q->where('user_id', $user->id)])
      ->withCount('likes')
      ->withCount('bookmarks')
      ->withAvg('reviews', 'rating')
      ->with('user')
      ->with(['reviews' => fn($q) => $q->where('user_id', $user->id)])
      ->paginate(4);

    return response()->json($bookmarkedBuilds);
  }

  public function update(Request $request, User $user): JsonResponse
  {
    $validated = $request->validate([
      'name' => ['sometimes', 'string', 'min:3', 'max:255'],
      'email' => ['sometimes', 'email', 'unique:users,email,' . $user->id],
      'description' => ['sometimes', 'nullable', 'string'],
      'password' => ['sometimes', 'required_with:new_password', 'string'],
      'new_password' => ['sometimes', 'string', 'confirmed', Password::min(3)->symbols()->letters()->numbers()->mixedCase()],
    ]);

    if (isset($validated['new_password'])) {
      if (!Hash::check($request->password, $user->password)) {
        return response()->json([
          'message' => __('messages.current_password_incorrect'),
          'errors' => ['password' => [__('messages.current_password_incorrect')]],
        ], 422);
      }

      $validated['password'] = bcrypt($validated['new_password']);
    }

    $user->update(Arr::except($validated, ['new_password', 'new_password_confirmation']));

    return response()->json($user, 200);
  }

  public function destroy(User $user): JsonResponse
  {
    $user->delete();
    return response()->json(null, 204);
  }
}
