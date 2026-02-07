<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Processor;
use App\Models\Motherboard;
use App\Models\Ram;
use App\Models\Gpu;
use App\Models\Ssd;
use App\Models\Psu;
use App\Models\Cases;
use App\Models\Fan;
use App\Models\Cooler;

class BuildController extends Controller
{
  public function generate(Request $request)
  {
    $budget = $request->input('budget', 2000);
    $originalBudget = $budget;

    $result = $this->attemptBuildWithRetries($budget);

    if ($result['success']) {
      $data = $result['data'];
      $data['original_budget'] = $originalBudget;

      if ($result['adjusted_budget'] !== $originalBudget) {
        $data['adjustments'] = [
          'budget_reduced' => true,
          'original_budget' => $originalBudget,
          'final_budget' => $result['adjusted_budget'],
          'reduction' => round($originalBudget - $result['adjusted_budget'], 2),
          'message' => 'Budget was reduced to find compatible components'
        ];
      }

      return response()->json($data);
    }

    return response()->json([
      'error' => 'Could not build PC with available components',
      'requested_budget' => $originalBudget,
      'message' => 'Try increasing budget or check component availability'
    ], 404);
  }

  protected function attemptBuildWithRetries($budget, $maxAttempts = 10)
  {
    for ($attempt = 1; $attempt <= $maxAttempts; $attempt++) {
      $result = $this->attemptBuild($budget, $attempt === $maxAttempts);

      if ($result['success']) {
        $result['adjusted_budget'] = $budget;
        return $result;
      }

      if ($attempt < $maxAttempts) {
        $budget = $budget * 0.98;
      }
    }

    return ['success' => false, 'error' => 'Max attempts reached'];
  }

  protected function attemptBuild($budget, $relaxed = false)
  {
    $allocations = $this->calculateBudgetAllocations($budget);

    $cpu = $this->selectCpu($allocations['cpu']);
    if (!$cpu) {
      return ['success' => false, 'error' => 'No CPU found'];
    }

    $mobo = $this->selectMotherboard($cpu, $allocations['mobo']);
    if (!$mobo) {
      return ['success' => false, 'error' => 'No motherboard found'];
    }

    $ram = $this->selectRam($mobo, $allocations['ram'], $relaxed);
    if (!$ram) {
      return ['success' => false, 'error' => 'No RAM found'];
    }

    $cooler = null;
    if (!$cpu->cooler_included) {
      $cooler = $this->selectCooler($allocations['cooler'], $cpu);
    }

    $gpu = $this->selectGpu($allocations['gpu']);
    $ssd = $this->selectSsd($allocations['ssd'], $relaxed);
    $psu = $this->selectPsu($allocations['psu'], $cpu, $gpu);
    $case = $this->selectCase($allocations['case'], $mobo);
    $fans = $this->selectFans($allocations['fans']);

    $total = $cpu->price + $mobo->price + $ram->price + 
             ($gpu->price ?? 0) + ($ssd->price ?? 0) + 
             ($psu->price ?? 0) + ($case->price ?? 0) + 
             ($fans->price ?? 0) + ($cooler->price ?? 0);

    return [
      'success' => true,
      'data' => [
        'cpu' => $cpu,
        'motherboard' => $mobo,
        'ram' => $ram,
        'cooler' => $cooler,
        'gpu' => $gpu,
        'ssd' => $ssd,
        'psu' => $psu,
        'case' => $case,
        'fans' => $fans,
        'total' => round($total, 2),
        'budget' => $budget,
        'remaining' => round($budget - $total, 2),
        'budget_breakdown' => [
          'cpu_budget' => $allocations['cpu'],
          'cpu_spent' => $cpu->price,
          'mobo_budget' => $allocations['mobo'],
          'mobo_spent' => $mobo->price,
          'ram_budget' => $allocations['ram'],
          'ram_spent' => $ram->price,
          'cooler_budget' => $allocations['cooler'],
          'cooler_spent' => $cooler->price ?? 0,
          'gpu_budget' => $allocations['gpu'],
          'gpu_spent' => $gpu->price ?? 0,
          'ssd_budget' => $allocations['ssd'],
          'ssd_spent' => $ssd->price ?? 0,
          'psu_budget' => $allocations['psu'],
          'psu_spent' => $psu->price ?? 0,
          'case_budget' => $allocations['case'],
          'case_spent' => $case->price ?? 0,
          'fans_budget' => $allocations['fans'],
          'fans_spent' => $fans->price ?? 0
        ],
        'compatibility' => [
          'cpu_socket' => $cpu->socket,
          'mobo_socket' => $mobo->socket,
          'socket_match' => $cpu->socket === $mobo->socket,
          'mobo_memory_type' => $mobo->memory_type,
          'ram_memory_type' => $ram->memory_type,
          'memory_type_match' => $mobo->memory_type === $ram->memory_type,
          'mobo_form_factor' => $mobo->form_factor,
          'case_form_factor' => $case->form_factor ?? 'ATX',
          'case_compatibility' => $this->checkCaseCompatibility($mobo, $case)
        ],
        'component_notes' => [
          'cpu' => $cpu->cooler_included ? 'CPU includes cooler' : null,
          'cooler' => !$cooler ? 'No cooler needed (included with CPU)' : null,
          'ram' => $ram->capacity < 16 ? 'Less than 16GB due to budget' : null,
          'ssd' => $ssd && $ssd->capacity < 512 ? 'Less than 512GB due to budget' : null,
          'case' => $case && $case->psu_included === 'Ir' ? 'Case includes PSU' : null,
          'fans' => $fans ? "Fan kit includes {$fans->quantity} fan(s)" : 'No fans selected'
        ]
      ]
    ];
  }

  protected function calculateBudgetAllocations($budget)
  {
    if ($budget < 600) {
      return [
        'cpu' => $budget * 0.25,
        'mobo' => $budget * 0.13,
        'ram' => $budget * 0.11,
        'cooler' => $budget * 0.04,
        'gpu' => $budget * 0.23,
        'ssd' => $budget * 0.09,
        'psu' => $budget * 0.08,
        'case' => $budget * 0.05,
        'fans' => $budget * 0.02
      ];
    } elseif ($budget < 1000) {
      return [
        'cpu' => $budget * 0.21,
        'mobo' => $budget * 0.10,
        'ram' => $budget * 0.13,
        'cooler' => $budget * 0.04,
        'gpu' => $budget * 0.30,
        'ssd' => $budget * 0.08,
        'psu' => $budget * 0.07,
        'case' => $budget * 0.05,
        'fans' => $budget * 0.02
      ];
    } elseif ($budget < 2000) {
      return [
        'cpu' => $budget * 0.18,
        'mobo' => $budget * 0.10,
        'ram' => $budget * 0.10,
        'cooler' => $budget * 0.05,
        'gpu' => $budget * 0.36,
        'ssd' => $budget * 0.08,
        'psu' => $budget * 0.07,
        'case' => $budget * 0.05,
        'fans' => $budget * 0.01
      ];
    } else {
      return [
        'cpu' => $budget * 0.16,
        'mobo' => $budget * 0.10,
        'ram' => $budget * 0.10,
        'cooler' => $budget * 0.06,
        'gpu' => $budget * 0.38,
        'ssd' => $budget * 0.08,
        'psu' => $budget * 0.07,
        'case' => $budget * 0.04,
        'fans' => $budget * 0.01
      ];
    }
  }

  protected function selectCpu($budget)
  {
    return Processor::whereNotNull('socket')
      ->whereNotNull('cores')
      ->whereNotNull('price')
      ->where('price', '<=', $budget)
      ->whereNotIn('socket', ['sWRX8', 'sTR5'])
      ->where('name', 'NOT LIKE', '%Threadripper%')
      ->where('name', 'NOT LIKE', '%PRO%')
      ->orderByDesc('cores')
      ->orderByDesc('frequency')
      ->first();
  }

  protected function selectMotherboard($cpu, $budget)
  {
    return Motherboard::where('socket', $cpu->socket)
      ->whereNotNull('memory_type')
      ->whereNotNull('price')
      ->where('price', '<=', $budget)
      ->orderByDesc('memory_slots')
      ->first();
  }

  protected function selectRam($mobo, $budget, $relaxed = false)
  {
    if (!$relaxed) {
      $ram = Ram::where('memory_type', $mobo->memory_type)
        ->whereNotNull('capacity')
        ->whereNotNull('price')
        ->where('capacity', '>=', 16)
        ->where('price', '<=', $budget * 1.2)
        ->orderByDesc('capacity')
        ->orderByDesc('frequency')
        ->first();

      if ($ram) {
        return $ram;
      }
    }

    return Ram::where('memory_type', $mobo->memory_type)
      ->whereNotNull('capacity')
      ->whereNotNull('price')
      ->where('capacity', '>=', 8)
      ->where('price', '<=', $budget)
      ->orderByDesc('capacity')
      ->orderByDesc('frequency')
      ->first();
  }

  protected function selectCooler($budget, $cpu)
  {
    $cpuTdp = $cpu->tdp ?? 65;

    $cooler = Cooler::whereNotNull('price')
      ->where('price', '<=', $budget)
      ->where(function($query) use ($cpuTdp) {
        $query->whereNull('tdp')
          ->orWhere('tdp', '>=', $cpuTdp);
      })
      ->orderByDesc('tdp')
      ->orderBy('price', 'asc')
      ->first();

    if (!$cooler) {
      $cooler = Cooler::whereNotNull('price')
        ->where('price', '<=', $budget)
        ->orderBy('price', 'asc')
        ->first();
    }

    return $cooler;
  }

  protected function selectGpu($budget)
  {
    return Gpu::whereNotNull('memory')
      ->whereNotNull('price')
      ->where('price', '<=', $budget)
      ->where('gpu_model', 'NOT LIKE', '%Pro%')
      ->where('gpu_model', 'NOT LIKE', '%Arc%')
      ->where('gpu_model', 'NOT LIKE', '%Quadro%')
      ->where('gpu_model', 'NOT LIKE', '%RTX A%')
      ->where('gpu_model', 'NOT LIKE', '%T1000%')
      ->where('gpu_model', 'NOT LIKE', '%T400%')
      ->orderByDesc('memory')
      ->orderByDesc('gpu_speed')
      ->first();
  }

  protected function selectSsd($budget, $relaxed = false)
  {
    if (!$relaxed) {
      $ssd = Ssd::whereNotNull('capacity')
        ->whereNotNull('price')
        ->where('capacity', '>=', 512)
        ->where('price', '<=', $budget)
        ->orderByDesc('capacity')
        ->orderByDesc('read_speed')
        ->first();

      if ($ssd) {
        return $ssd;
      }
    }

    return Ssd::whereNotNull('capacity')
      ->whereNotNull('price')
      ->where('price', '<=', $budget)
      ->orderByDesc('capacity')
      ->orderByDesc('read_speed')
      ->first();
  }

  protected function selectPsu($budget, $cpu, $gpu)
  {
    $cpuTdp = $cpu->tdp ?? 65;
    $gpuTdp = $gpu ? 250 : 0;
    $minimumWattage = ceil(($cpuTdp + $gpuTdp + 100) / 50) * 50;

    $minimumWattage = max(450, min($minimumWattage, 850));

    $psu = Psu::whereNotNull('wattage')
      ->whereNotNull('price')
      ->where('price', '<=', $budget)
      ->where('wattage', '>=', $minimumWattage)
      ->whereNotNull('certification')
      ->where('certification', '!=', 'Nav')
      ->orderBy('certification', 'desc')
      ->orderBy('wattage', 'asc')
      ->first();

    if (!$psu) {
      $psu = Psu::whereNotNull('wattage')
        ->whereNotNull('price')
        ->where('price', '<=', $budget)
        ->where('wattage', '>=', $minimumWattage)
        ->orderBy('wattage', 'asc')
        ->first();
    }

    if (!$psu) {
      $psu = Psu::whereNotNull('wattage')
        ->whereNotNull('price')
        ->where('price', '<=', $budget)
        ->orderByDesc('wattage')
        ->first();
    }

    return $psu;
  }

  protected function selectCase($budget, $mobo)
  {
    $moboFormFactor = $mobo->form_factor;
    $compatibleCases = $this->getCompatibleCaseFormFactors($moboFormFactor);

    $case = Cases::whereNotNull('price')
      ->where('price', '<=', $budget)
      ->where(function($query) use ($compatibleCases) {
        foreach ($compatibleCases as $formFactor) {
          $query->orWhere('form_factor', 'LIKE', "%{$formFactor}%");
        }
      })
      ->orderBy('price', 'desc')
      ->first();

    if (!$case) {
      $case = Cases::whereNotNull('price')
        ->where('price', '<=', $budget)
        ->orderBy('price', 'desc')
        ->first();
    }

    return $case;
  }

  protected function selectFans($budget)
  {
    $fans = Fan::whereNotNull('price')
      ->where('price', '<=', $budget)
      ->whereNotNull('quantity')
      ->whereNotNull('size')
      ->where('quantity', '>=', 2)
      ->whereIn('size', [120, 140])
      ->orderByDesc('quantity')
      ->orderBy('price', 'asc')
      ->first();

    if (!$fans) {
      $fans = Fan::whereNotNull('price')
        ->where('price', '<=', $budget)
        ->whereNotNull('size')
        ->whereIn('size', [120, 140])
        ->orderBy('price', 'asc')
        ->first();
    }

    return $fans;
  }

  protected function getCompatibleCaseFormFactors($moboFormFactor)
  {
    $compatibility = [
      'E-ATX' => ['E-ATX', 'Full Tower'],
      'ATX' => ['ATX', 'Mid Tower', 'Full Tower'],
      'Micro-ATX' => ['Micro-ATX', 'ATX', 'Mid Tower', 'Full Tower'],
      'Mini-ITX' => ['Mini-ITX', 'Micro-ATX', 'ATX', 'Mid Tower', 'Full Tower']
    ];

    return $compatibility[$moboFormFactor] ?? ['ATX', 'Mid Tower'];
  }

  protected function checkCaseCompatibility($mobo, $case)
  {
    if (!$case || !$case->form_factor) {
      return 'Unknown';
    }

    $compatibleFormFactors = $this->getCompatibleCaseFormFactors($mobo->form_factor);

    foreach ($compatibleFormFactors as $formFactor) {
      if (stripos($case->form_factor, $formFactor) !== false) {
        return 'Compatible';
      }
    }

    return 'Check manually';
  }
}
