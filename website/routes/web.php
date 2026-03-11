<?php

use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', fn() => Inertia::render('Home'))->name('home');

Route::middleware('guest')->group(function () {
    Route::get('/register', fn() => Inertia::render('Auth/Register'))->name('register');
    Route::post('/register', [AuthController::class, 'register']);

    Route::get('/login', fn() => Inertia::render('Auth/Login'))->name('login');
    Route::post('/login', [AuthController::class, 'login']);
});

Route::middleware('auth')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
    Route::get('/builder', fn() => Inertia::render('Builder'));
});
