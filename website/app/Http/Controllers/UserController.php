<?php

namespace App\Http\Controllers;

use App\Models\Build;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class UserController extends Controller
{
    public function index(Request $request): InertiaResponse
    {
        $user = $request->user();
        $builds = Build::where('user_id', $user->id)
            ->withCount('likes')
            ->withCount('bookmarks')
            ->withAvg('reviews', 'rating')
            ->get();
        return Inertia::render('Profile', ['user' => $user, 'builds' => $builds]);
    }

    public function update(Request $request, User $user): JsonResponse
    {
        $validated = $request->validate([
            'name'     => ['sometimes', 'string', 'max:255'],
            'email'    => ['sometimes', 'email', 'unique:users,email,' . $user->id],
            'description' => ['sometimes', 'nullable', 'string'],
            'password' => ['sometimes', 'string', 'min:8', 'confirmed'],
        ]);

        if (isset($validated['password'])) {
            $validated['password'] = bcrypt($validated['password']);
        }

        $user->update($validated);

        return response()->json($user, 200);
    }
}
