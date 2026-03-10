<?php

use App\Http\Controllers\BuilderController;
use App\Http\Controllers\ComponentController;
use Illuminate\Support\Facades\Route;

Route::get('/components/{type}', [ComponentController::class, 'index']);
Route::get('/components/{type}/{id}', [ComponentController::class, 'show']);
Route::post('/builder', [BuilderController::class, 'generate']);
