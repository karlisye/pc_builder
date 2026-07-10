<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\BuildController;
use App\Http\Controllers\BuilderController;
use App\Http\Controllers\ComponentController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register'])->middleware(['guest', 'throttle:auth']);
Route::post('/login', [AuthController::class, 'login'])->middleware(['guest', 'throttle:auth']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
Route::get('/user', [AuthController::class, 'user'])->middleware('auth:sanctum');

Route::get('/email/verify/{id}/{hash}', [AuthController::class, 'verify'])
  ->middleware(['signed', 'throttle:6,1'])
  ->name('verification.verify');
Route::post('/email/verification-notification', [AuthController::class, 'resendVerification'])
  ->middleware(['auth:sanctum', 'throttle:6,1']);

Route::get('/users/delete/{id}/{hash}', [UserController::class, 'confirmDelete'])
  ->middleware(['signed', 'throttle:6,1'])
  ->name('account.delete.verify');

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
  Route::post('/users/{user}/delete-confirmation', [UserController::class, 'sendDeleteConfirmation']);
});
