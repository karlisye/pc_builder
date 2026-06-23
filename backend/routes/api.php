<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BuildCommentController;
use App\Http\Controllers\BuildController;
use App\Http\Controllers\BuilderController;
use App\Http\Controllers\ComponentController;
use App\Http\Controllers\SharedController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register'])->middleware('guest');
Route::post('/login', [AuthController::class, 'login'])->middleware('guest');
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
Route::get('/user', [AuthController::class, 'user'])->middleware('auth:sanctum');

// Manual builder configuration is available to guests; auto-generate stays auth-only below.
Route::get('/components/{type}', [ComponentController::class, 'index']);
Route::get('/components/{type}/filters', [ComponentController::class, 'filters']);
Route::get('/components/{type}/{id}', [ComponentController::class, 'show']);
Route::post('/builder/validate', [BuilderController::class, 'validate']);
Route::get('/builder', [BuilderController::class, 'index']);

// Shared builds are viewable by guests; liking/reviewing/saving stay auth-only below.
Route::get('/shared', [SharedController::class, 'fetchBuilds']);
Route::get('/shared/{build}', [SharedController::class, 'show']);
Route::get('/shared/{build}/comments', [BuildCommentController::class, 'index']);

Route::middleware('auth:sanctum')->group(function () {
  Route::get('/builds', [BuildController::class, 'index']);

  Route::get('/profile', [UserController::class, 'index']);
  Route::get('/profile/liked', [UserController::class, 'indexLiked']);
  Route::get('/profile/{user}', [UserController::class, 'show']);

  Route::post('/builder', [BuilderController::class, 'generate']);
  Route::post('/builder/{type}', [BuilderController::class, 'generateComp']);

  Route::post('/builds', [BuildController::class, 'store']);
  Route::get('/builds/{build}', [BuildController::class, 'show']);  // must stay after /builds in group
  Route::patch('/builds/{build}', [BuildController::class, 'update']);
  Route::delete('/builds/{build}', [BuildController::class, 'destroy']);
  Route::patch('/builds/{build}/publish', [BuildController::class, 'publish']);

  Route::post('/shared/{build}/like', [SharedController::class, 'like']);
  Route::post('/shared/{build}/review', [SharedController::class, 'review']);
  Route::post('/shared/{build}/comments', [BuildCommentController::class, 'store']);
  Route::post('/comments/{comment}/like', [BuildCommentController::class, 'like']);
  Route::delete('/comments/{comment}', [BuildCommentController::class, 'destroy']);

  Route::patch('/users/{user}', [UserController::class, 'update']);
  Route::delete('/users/{user}', [UserController::class, 'destroy']);
});

Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {
  Route::post('/scrape', [AdminController::class, 'store']);
  Route::get('/scrape/history', [AdminController::class, 'fetchHistory']);
  Route::post('/admin/scrape', [AdminController::class, 'scrape']);
  Route::post('/admin/populate', [AdminController::class, 'populate']);
  Route::get('/admin', [AdminController::class, 'index']);
});
