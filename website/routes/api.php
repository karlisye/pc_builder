<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BuildController;
use App\Http\Controllers\ComponentController;

Route::post('/build/generate', [BuildController::class, 'generate']);

Route::get('/components/{component}', [ComponentController::class, 'show']);
