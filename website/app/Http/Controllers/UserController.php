<?php

namespace App\Http\Controllers;

use App\Models\Build;
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
}
