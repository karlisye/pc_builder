<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\BuildService;
use Inertia\Inertia;

class BuildController extends Controller
{
  protected $buildService;

  public function __construct(BuildService $buildService)
  {
    $this->buildService = $buildService;
  }

  public function index()
  {
    return Inertia::render('Build');
  }

  public function generate(Request $request)
  {
    $validated = $request->validate([
      'budget' => 'required|numeric|min:400|max:10000'
    ]);

    $budget = $validated['budget'];

    $result = $this->buildService->generateBuild($budget);

    if ($result['success']) {
      return response()->json($result['data']);
    }

    return response()->json([
      'error' => 'Could not build PC with available components',
      'requested_budget' => $budget,
      'message' => 'Try increasing budget or check component availability'
    ], 422);
  }
}
