<?php

namespace App\Services;

use App\Services\BudgetAllocationService;
use App\Services\ComponentSelectors\CpuSelector;
use App\Services\ComponentSelectors\MotherboardSelector;
use App\Services\ComponentSelectors\RamSelector;
use App\Services\ComponentSelectors\GpuSelector;
use App\Services\ComponentSelectors\SsdSelector;
use App\Services\ComponentSelectors\PsuSelector;
use App\Services\ComponentSelectors\CaseSelector;
use App\Services\ComponentSelectors\FanSelector;
use App\Services\ComponentSelectors\CoolerSelector;
use App\Helpers\CompatibilityHelper;
use App\Models\Processor;
use App\Models\Motherboard;
use App\Models\Ram;
use App\Models\Cooler;
use App\Models\Gpu;
use App\Models\Ssd;
use App\Models\Psu;
use App\Models\Cases;
use App\Models\Fan;

class BuildService
{
  protected $budgetService;
  protected $cpuSelector;
  protected $moboSelector;
  protected $ramSelector;
  protected $gpuSelector;
  protected $ssdSelector;
  protected $psuSelector;
  protected $caseSelector;
  protected $fanSelector;
  protected $coolerSelector;
  protected $compatibilityHelper;

  public function __construct(
    BudgetAllocationService $budgetService,
    CpuSelector $cpuSelector,
    MotherboardSelector $moboSelector,
    RamSelector $ramSelector,
    GpuSelector $gpuSelector,
    SsdSelector $ssdSelector,
    PsuSelector $psuSelector,
    CaseSelector $caseSelector,
    FanSelector $fanSelector,
    CoolerSelector $coolerSelector,
    CompatibilityHelper $compatibilityHelper
  ) {
    $this->budgetService = $budgetService;
    $this->cpuSelector = $cpuSelector;
    $this->moboSelector = $moboSelector;
    $this->ramSelector = $ramSelector;
    $this->gpuSelector = $gpuSelector;
    $this->ssdSelector = $ssdSelector;
    $this->psuSelector = $psuSelector;
    $this->caseSelector = $caseSelector;
    $this->fanSelector = $fanSelector;
    $this->coolerSelector = $coolerSelector;
    $this->compatibilityHelper = $compatibilityHelper;
  }
 
  public function generateBuild($budget, $maxAttempts = 10, array $locked = [])
  {
    $originalBudget = $budget;

    // Resolve locked IDs to models once up front
    $lockedModels = [];
    $map = [
      'cpu' => Processor::class,
      'motherboard' => Motherboard::class,
      'ram' => Ram::class,
      'cooler' => Cooler::class,
      'gpu' => Gpu::class,
      'ssd' => Ssd::class,
      'psu' => Psu::class,
      'case' => Cases::class,
      'fans' => Fan::class,
    ];

    foreach ($map as $key => $modelClass) {
      if (isset($locked[$key])) {
        $model = $modelClass::find($locked[$key]);
        if ($model) {
          $lockedModels[$key] = $model;
        }
      }
    }

    $result = $this->attemptBuild(
      $budget,
      $originalBudget,
      false,
      $lockedModels
    );

    if ($result['success']) {
      $data = $result['data'];
      $data['original_budget'] = $originalBudget;

      return ['success' => true, 'data' => $data];
    }

    return ['success' => false, 'error' => $result['error'] ?? 'Could not build PC'];
  }

  protected function attemptBuild($budget, $originalBudget, $relaxed = false, array $locked = [])
  {
    $remainingBudget = $budget;
    $selectedComponents = [];

    $allocations = $this->budgetService->calculateInitial($budget);
 
    // CPU (allow locked)
    if (isset($locked['cpu'])) {
      $cpu = $locked['cpu'];
    } else {
      $cpu = $this->cpuSelector->select($allocations['cpu'], $budget);
      // Fallback to any reasonable CPU if strict budgeted search fails
      if (!$cpu) {
        $cpu = Processor::whereNotNull('socket')
          ->whereNotNull('cores')
          ->whereNotNull('price')
          ->whereNotIn('socket', ['sWRX8', 'sTR5'])
          ->orderBy('price', 'asc')
          ->first();
      }
    }

    if (!$cpu) {
      return ['success' => false, 'error' => 'No CPU found'];
    }
    $remainingBudget -= $cpu->price;
    $selectedComponents[] = 'cpu';

    $allocations = $this->budgetService->recalculateRemaining($remainingBudget, $selectedComponents);

    // Motherboard (allow locked, must be compatible socket)
    if (isset($locked['motherboard'])) {
      $mobo = $locked['motherboard'];
      if ($mobo->socket !== $cpu->socket) {
        return ['success' => false, 'error' => 'Locked motherboard is not compatible with CPU socket'];
      }
    } else {
      $mobo = $this->moboSelector->select($allocations['mobo'], $cpu);
      if (!$mobo) {
        // Fallback: pick the cheapest board that matches the CPU socket
        $mobo = Motherboard::where('socket', $cpu->socket)
          ->whereNotNull('price')
          ->orderBy('price', 'asc')
          ->first();
      }
    }

    if (!$mobo) return ['success' => false, 'error' => 'No motherboard found'];
    $remainingBudget -= $mobo->price;
    $selectedComponents[] = 'mobo';

    $allocations = $this->budgetService->recalculateRemaining($remainingBudget, $selectedComponents);

    // RAM (allow locked, must match mobo memory type)
    if (isset($locked['ram'])) {
      $ram = $locked['ram'];
      if ($ram->memory_type !== $mobo->memory_type) {
        return ['success' => false, 'error' => 'Locked RAM is not compatible with motherboard memory type'];
      }
    } else {
      $ram = $this->ramSelector->select($allocations['ram'], $mobo, $relaxed);
      if (!$ram) {
        // Fallback: any RAM matching memory type
        $ram = Ram::where('memory_type', $mobo->memory_type)
          ->whereNotNull('price')
          ->orderBy('price', 'asc')
          ->first();
      }
    }
    if (!$ram) return ['success' => false, 'error' => 'No RAM found'];
    $remainingBudget -= $ram->price;
    $selectedComponents[] = 'ram';

    $allocations = $this->budgetService->recalculateRemaining($remainingBudget, $selectedComponents);

    // Cooler (allow locked)
    $cooler = null;
    if (isset($locked['cooler'])) {
      $cooler = $locked['cooler'];
      $remainingBudget -= $cooler->price;
      $selectedComponents[] = 'cooler';
    } elseif (
      !$cpu->cooler_included &&
      isset($allocations['cooler']) &&
      $allocations['cooler'] > 0
    ) {
      $cooler = $this->coolerSelector->select($allocations['cooler'], $cpu);
      if ($cooler) {
        $remainingBudget -= $cooler->price;
        $selectedComponents[] = 'cooler';
      }
    }

    $allocations = $this->budgetService->recalculateRemaining($remainingBudget, $selectedComponents);

    // GPU (allow locked)
    $gpu = null;
    if (isset($locked['gpu'])) {
      $gpu = $locked['gpu'];
      $remainingBudget -= $gpu->price;
      $selectedComponents[] = 'gpu';
    } elseif ($originalBudget >= 600 && isset($allocations['gpu']) && $allocations['gpu'] > 0) {
      $gpu = $this->gpuSelector->select($allocations['gpu']);
      if ($gpu) {
        $remainingBudget -= $gpu->price;
        $selectedComponents[] = 'gpu';
      }
    }

    $allocations = $this->budgetService->recalculateRemaining($remainingBudget, $selectedComponents);

    // SSD (allow locked)
    if (isset($locked['ssd'])) {
      $ssd = $locked['ssd'];
      $remainingBudget -= $ssd->price;
      $selectedComponents[] = 'ssd';
    } else {
      $ssd = $this->ssdSelector->select($allocations['ssd'] ?? $remainingBudget * 0.3, $relaxed);
      if (!$ssd) {
        // Fallback: any SSD within remaining budget, or cheapest overall
        $ssd = Ssd::whereNotNull('price')
          ->where('price', '<=', $remainingBudget)
          ->orderBy('price', 'asc')
          ->first()
          ?? Ssd::whereNotNull('price')->orderBy('price', 'asc')->first();
      }
      if (!$ssd) return ['success' => false, 'error' => 'No SSD found'];
      $remainingBudget -= $ssd->price;
      $selectedComponents[] = 'ssd';
    }

    $allocations = $this->budgetService->recalculateRemaining($remainingBudget, $selectedComponents);

    // PSU (allow locked)
    if (isset($locked['psu'])) {
      $psu = $locked['psu'];
      $remainingBudget -= $psu->price;
      $selectedComponents[] = 'psu';
    } else {
      $psu = $this->psuSelector->select($allocations['psu'] ?? $remainingBudget * 0.4, $cpu, $gpu);
      if (!$psu) {
        // Fallback: any PSU within remaining budget, or cheapest overall
        $psu = Psu::whereNotNull('price')
          ->where('price', '<=', $remainingBudget)
          ->orderBy('price', 'asc')
          ->first()
          ?? Psu::whereNotNull('price')->orderBy('price', 'asc')->first();
      }
      if (!$psu) return ['success' => false, 'error' => 'No PSU found'];
      $remainingBudget -= $psu->price;
      $selectedComponents[] = 'psu';
    }

    $allocations = $this->budgetService->recalculateRemaining($remainingBudget, $selectedComponents);

    // Case (allow locked)
    if (isset($locked['case'])) {
      $case = $locked['case'];
      $remainingBudget -= $case->price;
      $selectedComponents[] = 'case';
    } else {
      $case = $this->caseSelector->select($allocations['case'] ?? $remainingBudget * 0.5, $mobo);
      if ($case) {
        $remainingBudget -= $case->price;
        $selectedComponents[] = 'case';
      }
    }

    // Fans (allow locked)
    $fans = null;
    if (isset($locked['fans'])) {
      $fans = $locked['fans'];
      $remainingBudget -= $fans->price;
      $selectedComponents[] = 'fans';
    } elseif ($remainingBudget > 10) {
      $fans = $this->fanSelector->select($remainingBudget);
    }

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
        'budget' => $originalBudget,
        'remaining' => round($originalBudget - $total, 2),
        'build_type' => $originalBudget < 600 ? 'APU Build (Integrated Graphics)' : 'Discrete GPU Build',
        'allocation_method' => 'Dynamic Sequential',
      ]
    ];
  }

  protected function buildBudgetBreakdown($allocations, $components)
  {
    return [
      'cpu_budget' => $allocations['cpu'],
      'cpu_spent' => $components['cpu']->price,
      'mobo_budget' => $allocations['mobo'],
      'mobo_spent' => $components['mobo']->price,
      'ram_budget' => $allocations['ram'],
      'ram_spent' => $components['ram']->price,
      'cooler_budget' => $allocations['cooler'],
      'cooler_spent' => $components['cooler']->price ?? 0,
      'gpu_budget' => $allocations['gpu'],
      'gpu_spent' => $components['gpu']->price ?? 0,
      'ssd_budget' => $allocations['ssd'],
      'ssd_spent' => $components['ssd']->price ?? 0,
      'psu_budget' => $allocations['psu'],
      'psu_spent' => $components['psu']->price ?? 0,
      'case_budget' => $allocations['case'],
      'case_spent' => $components['case']->price ?? 0,
      'fans_budget' => $allocations['fans'],
      'fans_spent' => $components['fans']->price ?? 0
    ];
  }

  protected function buildComponentNotes($cpu, $cooler, $ram, $ssd, $case, $fans)
  {
    return [
      'cpu' => $cpu->cooler_included ? 'A cooler is included with the processor' : null,
      'cooler' => !$cooler ? 'Not needed (Included with the processor)' : null,
      'ram' => $ram->capacity < 16 ? 'Under 16GB due to low budget' : null,
      'ssd' => $ssd && $ssd->capacity < 512 ? 'Under 512GB due to budget' : null,
      'case' => $case && $case->psu_included === 'Ir' ? 'A power supply is included with the case' : null,
      'fans' => $fans ? "Fan kit includes {$fans->quantity} fans" : 'No fans included'
    ];
  }
}
