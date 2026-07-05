<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BuildController;
use App\Http\Controllers\BuilderController;
use App\Http\Controllers\ComponentController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register'])->middleware('guest');
Route::post('/login', [AuthController::class, 'login'])->middleware('guest');
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
Route::get('/user', [AuthController::class, 'user'])->middleware('auth:sanctum');

Route::get('/email/verify/{id}/{hash}', [AuthController::class, 'verify'])
  ->middleware(['signed', 'throttle:6,1'])
  ->name('verification.verify');
Route::post('/email/verification-notification', [AuthController::class, 'resendVerification'])
  ->middleware(['auth:sanctum', 'throttle:6,1']);

Route::get('/components/{type}', [ComponentController::class, 'index'])->middleware('throttle:component-browse');
Route::get('/components/{type}/filters', [ComponentController::class, 'filters'])->middleware('throttle:component-browse');
Route::get('/components/{type}/{id}', [ComponentController::class, 'show']);
Route::post('/builder/validate', [BuilderController::class, 'validate']);
Route::get('/builder', [BuilderController::class, 'index']);

Route::middleware('auth:sanctum')->group(function () {
  Route::post('/builder', [BuilderController::class, 'generate'])->middleware(['throttle:builder-generate', 'verified']);
  Route::post('/builder/{type}', [BuilderController::class, 'generateComp'])->middleware(['throttle:builder-generate', 'verified']);

  Route::get('/builds', [BuildController::class, 'index']);
  Route::post('/builds', [BuildController::class, 'store'])->middleware('verified');
  Route::get('/builds/{build}', [BuildController::class, 'show']);
  Route::patch('/builds/{build}', [BuildController::class, 'update']);
  Route::delete('/builds/{build}', [BuildController::class, 'destroy']);
  Route::post('/builds/{build}/share', [BuildController::class, 'share']);

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
