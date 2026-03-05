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

  public function custom()
  {
    return Inertia::render('Custom');
  }

  public function generate(Request $request)
  {
    $validated = $request->validate([
      'budget' => 'required|numeric|min:400|max:10000',
      'locked' => 'sometimes|array',
      'locked.cpu' => 'sometimes|integer|exists:processors,id',
      'locked.motherboard' => 'sometimes|integer|exists:motherboards,id',
      'locked.ram' => 'sometimes|integer|exists:rams,id',
      'locked.cooler' => 'sometimes|integer|exists:coolers,id',
      'locked.gpu' => 'sometimes|integer|exists:gpus,id',
      'locked.ssd' => 'sometimes|integer|exists:ssds,id',
      'locked.psu' => 'sometimes|integer|exists:psus,id',
      'locked.case' => 'sometimes|integer|exists:cases,id',
      'locked.fans' => 'sometimes|integer|exists:fans,id',
    ]);

    $budget = $validated['budget'];
    $locked = $validated['locked'] ?? [];

    $result = $this->buildService->generateBuild($budget, 10, $locked);

    if ($result['success']) {
      return response()->json($result['data']);
    }

    return response()->json([
      'error' => $result['error'] ?? 'Could not build PC with available components',
      'requested_budget' => $budget,
      'message' => 'Try increasing budget, changing locked parts, or check component availability'
    ], 422);
  }
}
