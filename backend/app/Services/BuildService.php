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

  public function generateBuild($budget, $maxAttempts = 10)
  {
    $originalBudget = $budget;

    for ($attempt = 1; $attempt <= $maxAttempts; $attempt++) {
      $result = $this->attemptBuild($budget, $attempt === $maxAttempts);

      if ($result['success']) {
        $data = $result['data'];
        $data['original_budget'] = $originalBudget;

        if ($budget !== $originalBudget) {
          $data['adjustments'] = [
            'budget_reduced' => true,
            'original_budget' => $originalBudget,
            'final_budget' => $budget,
            'reduction' => round($originalBudget - $budget, 2),
            'message' => 'Budžets tika samazināts, lai atrastu derīgas detaļas'
          ];
        }

        return ['success' => true, 'data' => $data];
      }

      if ($attempt < $maxAttempts) {
        $budget = $budget * 0.98;
      }
    }

    return ['success' => false, 'error' => 'Max attempts reached'];
  }

  protected function attemptBuild($budget, $relaxed = false)
  {
    $originalBudget = $budget;
    $remainingBudget = $budget;
    $selectedComponents = [];

    $allocations = $this->budgetService->calculateInitial($budget);

    $cpu = $this->cpuSelector->select($allocations['cpu'], $budget);
    if (!$cpu) {
      if ($budget < 600) {
        return ['success' => false, 'error' => 'No APU found for budget build'];
      }
      return ['success' => false, 'error' => 'No CPU found'];
    }
    $remainingBudget -= $cpu->price;
    $selectedComponents[] = 'cpu';

    $allocations = $this->budgetService->recalculateRemaining($remainingBudget, $selectedComponents);

    $mobo = $this->moboSelector->select($allocations['mobo'], $cpu);
    if (!$mobo) return ['success' => false, 'error' => 'No motherboard found'];
    $remainingBudget -= $mobo->price;
    $selectedComponents[] = 'mobo';

    $allocations = $this->budgetService->recalculateRemaining($remainingBudget, $selectedComponents);

    $ram = $this->ramSelector->select($allocations['ram'], $mobo, $relaxed);
    if (!$ram) return ['success' => false, 'error' => 'No RAM found'];
    $remainingBudget -= $ram->price;
    $selectedComponents[] = 'ram';

    $allocations = $this->budgetService->recalculateRemaining($remainingBudget, $selectedComponents);

    $cooler = null;
    if (!$cpu->cooler_included && isset($allocations['cooler']) && $allocations['cooler'] > 0) {
      $cooler = $this->coolerSelector->select($allocations['cooler'], $cpu);
      if ($cooler) {
        $remainingBudget -= $cooler->price;
        $selectedComponents[] = 'cooler';
      }
    }

    $allocations = $this->budgetService->recalculateRemaining($remainingBudget, $selectedComponents);

    $gpu = null;
    if ($originalBudget >= 600 && isset($allocations['gpu']) && $allocations['gpu'] > 0) {
      $gpu = $this->gpuSelector->select($allocations['gpu']);
      if ($gpu) {
        $remainingBudget -= $gpu->price;
        $selectedComponents[] = 'gpu';
      }
    }

    $allocations = $this->budgetService->recalculateRemaining($remainingBudget, $selectedComponents);

    $ssd = $this->ssdSelector->select($allocations['ssd'] ?? $remainingBudget * 0.3, $relaxed);
    if ($ssd) {
      $remainingBudget -= $ssd->price;
      $selectedComponents[] = 'ssd';
    }

    $allocations = $this->budgetService->recalculateRemaining($remainingBudget, $selectedComponents);

    $psu = $this->psuSelector->select($allocations['psu'] ?? $remainingBudget * 0.4, $cpu, $gpu);
    if ($psu) {
      $remainingBudget -= $psu->price;
      $selectedComponents[] = 'psu';
    }

    $allocations = $this->budgetService->recalculateRemaining($remainingBudget, $selectedComponents);

    $case = $this->caseSelector->select($allocations['case'] ?? $remainingBudget * 0.5, $mobo);
    if ($case) {
      $remainingBudget -= $case->price;
      $selectedComponents[] = 'case';
    }

    $fans = null;
    if ($remainingBudget > 10) {
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
      'cpu' => $cpu->cooler_included ? 'Procesora komplektā ir iekļauts dzesētājs' : null,
      'cooler' => !$cooler ? 'Nav nepieciešams (Ir iekļauts procesora komplektā)' : null,
      'ram' => $ram->capacity < 16 ? 'Zem 16GB zema budžeta dēļ' : null,
      'ssd' => $ssd && $ssd->capacity < 512 ? 'Zem 512 GB budžeta dēļ' : null,
      'case' => $case && $case->psu_included === 'Ir' ? 'Korpusa komplektā ir iekļauts barošanās bloks' : null,
      'fans' => $fans ? "Ventilātoru komplektā iekļauti {$fans->quantity} ventilātori" : 'Nav ventilātoru'
    ];
  }
}
