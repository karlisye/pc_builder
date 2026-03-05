<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BuildController;
use Inertia\Inertia;

Route::get('/', fn() => Inertia::render('Home'));
Route::get('/build', [BuildController::class, 'index']);
Route::get('/custom', [BuildController::class, 'custom']);
Route::fallback(fn() => Inertia::render('NotFound'));
