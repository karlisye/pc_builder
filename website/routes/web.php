<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BuildController;
use App\Http\Controllers\BuilderController;
use App\Http\Controllers\SharedController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', fn() => Inertia::render('Home'))->name('home');
Route::get('/guide', fn() => Inertia::render('Guide'))->name('guide');

Route::middleware('guest')->group(function () {
  Route::get('/register', fn() => Inertia::render('Auth/Register'))->name('register');
  Route::post('/register', [AuthController::class, 'register']);

  Route::get('/login', fn() => Inertia::render('Auth/Login'))->name('login');
  Route::post('/login', [AuthController::class, 'login']);
});

Route::middleware('auth')->group(function () {
  Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
  Route::get('/builder', [BuilderController::class, 'index']);
  Route::get('/builds', [BuildController::class, 'index']);
  Route::get('/shared', [SharedController::class, 'index']);
  Route::get('/profile', [UserController::class, 'index']);
  Route::get('/profile/account', [UserController::class, 'indexAccount']);
  Route::get('/profile/bookmarked', [UserController::class, 'indexBookmarked']);
  Route::get('/profile/{user}', [UserController::class, 'show']);
});

Route::middleware('role:admin')->group(function () {
  Route::get('/admin', [AdminController::class, 'index']);
  Route::get('/admin/scrape', fn() => Inertia::render('Admin/Scraper'));
  Route::post('/admin/scrape', [AdminController::class, 'scrape']);
  Route::get('/admin/history', fn() => Inertia::render('Admin/History'));
  Route::get('/admin/test', fn() => Inertia::render('Admin/Test'));
});

Route::fallback(fn() => Inertia::render('NotFound'));
