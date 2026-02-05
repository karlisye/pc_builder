<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BuildController;
use App\Models\Processor;

Route::get('/test', function() {
    return response()->json([
        'processors_count' => Processor::count(),
        'first_processor' => Processor::first()
    ]);
});

Route::get('/build/generate', [BuildController::class, 'generate']);
Route::post('/build/check-compatibility', [BuildController::class, 'checkCompatibility']);