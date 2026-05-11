<?php

namespace App\Http\Controllers;

use App\Models\Build;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class UserController extends Controller
{
  public function show(Request $request, User $user): InertiaResponse
  {
    $builds = Build::query()
      ->where('user_id', $user->id)
      ->withCount('likes')
      ->withCount('bookmarks')
      ->withAvg('reviews', 'rating')
      ->where('is_public', true)
      ->paginate(4);

    $totalLikes = $user->totalLikes();
    $totalBookmarks = $user->totalBookmarks();
    $avgRating = $user->averageRating();

    return Inertia::render('Components/Profile/PublicProfile', [
      'user' => $user,
      'buildData' => $builds,
      'totalLikes' => $totalLikes,
      'totalBookmarks' => $totalBookmarks,
      'avgRating' => $avgRating
    ]);
  }

  public function index(Request $request): InertiaResponse
  {
    $user = $request->user();

    $shared = fn() => Build::query()
      ->where('user_id', $user->id)
      ->withCount('likes')
      ->withCount('bookmarks')
      ->withAvg('reviews', 'rating');

    $privateBuilds = $shared()->where('is_public', false)->paginate(2, ['*'], 'privatePage');
    $publicBuilds  = $shared()->where('is_public', true)->paginate(2, ['*'], 'publicPage');

    return Inertia::render('Profile', ['user' => $user, 'privateBuildData' => $privateBuilds, 'publicBuildData' => $publicBuilds]);
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
          'message' => 'The current password is incorrect.',
          'errors' => ['password' => ['The current password is incorrect.']],
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
