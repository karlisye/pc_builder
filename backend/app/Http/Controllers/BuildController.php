<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\BuildService;

class BuildController extends Controller
{
  protected $buildService;

  public function __construct(BuildService $buildService)
  {
    $this->buildService = $buildService;
  }

  public function generate(Request $request)
  {
    $validated = $request->validate([
      'budget' => 'required|numeric|min:400|max:10000',
      'locked' => 'nullable|array',
      'locked.*' => 'nullable|numeric',
      'exclude' => 'nullable|array',
      'exclude.*' => 'in:cpu,mobo,ram,cooler,gpu,ssd,psu,case,fans'
    ]);

    $budget = $validated['budget'];
    $locked = $validated['locked'];
    $exclude = $validated['exclude'];

    $result = $this->buildService->generateBuild($budget, $locked, $exclude);

    if ($result['success']) {
      return response()->json($result['data']);
    }

    return response()->json([
      'error' => 'Could not build PC with available components',
      'requested_budget' => $budget,
      'locked_components' => array_keys($locked),
      'excluded_components' => $exclude,
      'message' => 'Try increasing budget or check component availability'
    ], 404);
  }
}
