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
            'message' => 'Budget was reduced to find compatible components'
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
    $allocations = $this->budgetService->calculate($budget);

    $cpu = $this->cpuSelector->select($allocations['cpu']);
    if (!$cpu) return ['success' => false, 'error' => 'No CPU found'];

    $mobo = $this->moboSelector->select($allocations['mobo'], $cpu);
    if (!$mobo) return ['success' => false, 'error' => 'No motherboard found'];

    $ram = $this->ramSelector->select($allocations['ram'], $mobo, $relaxed);
    if (!$ram) return ['success' => false, 'error' => 'No RAM found'];

    $cooler = null;
    if (!$cpu->cooler_included) {
      $cooler = $this->coolerSelector->select($allocations['cooler'], $cpu);
    }

    $gpu = $this->gpuSelector->select($allocations['gpu']);
    $ssd = $this->ssdSelector->select($allocations['ssd'], $relaxed);
    $psu = $this->psuSelector->select($allocations['psu'], $cpu, $gpu);
    $case = $this->caseSelector->select($allocations['case'], $mobo);
    $fans = $this->fanSelector->select($allocations['fans']);

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
        'budget_breakdown' => $this->buildBudgetBreakdown($allocations, [
          'cpu' => $cpu,
          'mobo' => $mobo,
          'ram' => $ram,
          'cooler' => $cooler,
          'gpu' => $gpu,
          'ssd' => $ssd,
          'psu' => $psu,
          'case' => $case,
          'fans' => $fans
        ]),
        'compatibility' => $this->compatibilityHelper->check($cpu, $mobo, $ram, $case),
        'component_notes' => $this->buildComponentNotes($cpu, $cooler, $ram, $ssd, $case, $fans)
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
      'cpu' => $cpu->cooler_included ? 'CPU includes cooler' : null,
      'cooler' => !$cooler ? 'No cooler needed (included with CPU)' : null,
      'ram' => $ram->capacity < 16 ? 'Less than 16GB due to budget' : null,
      'ssd' => $ssd && $ssd->capacity < 512 ? 'Less than 512GB due to budget' : null,
      'case' => $case && $case->psu_included === 'Ir' ? 'Case includes PSU' : null,
      'fans' => $fans ? "Fan kit includes {$fans->quantity} fan(s)" : 'No fans selected'
    ];
  }
}
