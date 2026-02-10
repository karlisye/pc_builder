<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BuildController;
use App\Models\Processor;

Route::get('/test', function () {
  return response()->json([
    'processors_count' => Processor::count(),
    'first_processor' => Processor::first()
  ]);
});

Route::get('/build/generate', [BuildController::class, 'generate']);

Route::get('/test/builds', function () {
  $buildService = app(\App\Services\BuildService::class);

  $budgets = [500, 600, 800, 1000, 1500, 2000];
  $results = [];

  foreach ($budgets as $budget) {
    $result = $buildService->generateBuild($budget);

    if ($result['success']) {
      $data = $result['data'];
      $results[$budget] = [
        'success' => true,
        'cpu' => $data['cpu']->name ?? 'N/A',
        'cpu_has_graphics' => app(\App\Services\ComponentSelectors\CpuSelector::class)->hasIntegratedGraphics($data['cpu']),
        'gpu' => $data['gpu']->name ?? 'NO GPU (APU Build)',
        'total' => $data['total'],
        'remaining' => $data['remaining']
      ];
    } else {
      $results[$budget] = [
        'success' => false,
        'error' => $result['error']
      ];
    }
  }

  return response()->json($results, 200, [], JSON_PRETTY_PRINT);
});
