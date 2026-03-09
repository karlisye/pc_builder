<?php

use App\Http\Controllers\BuilderController;
use App\Http\Controllers\ComponentController;
use Illuminate\Support\Facades\Route;

Route::get('/components/{type}', [ComponentController::class, 'index']);
Route::post('/builder', [BuilderController::class, 'generate']);
