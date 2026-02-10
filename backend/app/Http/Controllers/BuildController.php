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
    $budget = $request->input('budget', 2000);

    $result = $this->buildService->generateBuild($budget);

    if ($result['success']) {
      return response()->json($result['data']);
    }

    return response()->json([
      'error' => 'Could not build PC with available components',
      'requested_budget' => $budget,
      'message' => 'Try increasing budget or check component availability'
    ], 404);
  }
}
