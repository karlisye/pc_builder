<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BuildController;

Route::post('/build/generate', [BuildController::class, 'generate']);
