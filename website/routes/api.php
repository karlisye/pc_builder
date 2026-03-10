<?php

use App\Http\Controllers\BuildController;
use App\Http\Controllers\BuilderController;
use App\Http\Controllers\ComponentController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth')->group(function () {
  Route::get('/components/{type}', [ComponentController::class, 'index']);
  Route::get('/components/{type}/{id}', [ComponentController::class, 'show']);
  Route::post('/builder', [BuilderController::class, 'generate']);

  Route::get('/builds', [BuildController::class, 'index']);
  Route::post('/builds', [BuildController::class, 'store']);
  Route::get('/builds/{build}', [BuildController::class, 'show']);
  Route::patch('/builds/{build}', [BuildController::class, 'update']);
  Route::delete('/builds/{build}', [BuildController::class, 'destroy']);
});
