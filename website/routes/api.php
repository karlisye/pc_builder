<?php

use App\Http\Controllers\BuildController;
use App\Http\Controllers\BuilderController;
use App\Http\Controllers\ComponentController;
use App\Http\Controllers\SharedController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function () {
  Route::get('/components/{type}', [ComponentController::class, 'index']);
  Route::get('/components/{type}/filters', [ComponentController::class, 'filters']);
  Route::get('/components/{type}/{id}', [ComponentController::class, 'show']);

  Route::post('/builder', [BuilderController::class, 'generate']);
  Route::post('/builder/{type}', [BuilderController::class, 'generateComp']);

  Route::post('/builds', [BuildController::class, 'store']);
  Route::get('/builds/{build}', [BuildController::class, 'show']);
  Route::patch('/builds/{build}', [BuildController::class, 'update']);
  Route::delete('/builds/{build}', [BuildController::class, 'destroy']);
  Route::patch('/builds/{build}/publish', [BuildController::class, 'publish']);

  Route::post('/shared/{build}/like', [SharedController::class, 'like']);
  Route::post('/shared/{build}/bookmark', [SharedController::class, 'bookmark']);
  Route::post('/shared/{build}/review', [SharedController::class, 'review']);
  Route::get('/shared', [SharedController::class, 'fetchBuilds']);

  Route::patch('/users/{user}', [UserController::class, 'update']);
});
