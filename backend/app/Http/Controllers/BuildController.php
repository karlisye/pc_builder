<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Processor;
use App\Models\Motherboard;
use App\Models\Ram;
use App\Models\Gpu;
use App\Models\Ssd;
use App\Models\Psu;

class BuildController extends Controller
{
  public function generate(Request $request)
  {
    $budget = $request->input('budget', 2000);

    $allocations = $this->calculateBudgetAllocations($budget);

    $cpu = $this->selectCpu($allocations['cpu']);

    if (!$cpu) {
      return response()->json(['error' => 'No CPU found within budget'], 404);
    }

    $mobo = $this->selectMotherboard($cpu, $allocations['mobo']);

    if (!$mobo) {
      return response()->json(['error' => 'No compatible motherboard found'], 404);
    }

    $ram = $this->selectRam($mobo, $allocations['ram']);

    if (!$ram) {
      return response()->json(['error' => 'No compatible RAM found'], 404);
    }

    $gpu = $this->selectGpu($allocations['gpu']);
    $ssd = $this->selectSsd($allocations['ssd']);
    $psu = $this->selectPsu($allocations['psu'], $cpu, $gpu);

    $total = $cpu->price + $mobo->price + $ram->price + 
             ($gpu->price ?? 0) + ($ssd->price ?? 0) + ($psu->price ?? 0);

    return response()->json([
      'cpu' => $cpu,
      'motherboard' => $mobo,
      'ram' => $ram,
      'gpu' => $gpu,
      'ssd' => $ssd,
      'psu' => $psu,
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
        'gpu_budget' => $allocations['gpu'],
        'gpu_spent' => $gpu->price ?? 0,
        'ssd_budget' => $allocations['ssd'],
        'ssd_spent' => $ssd->price ?? 0,
        'psu_budget' => $allocations['psu'],
        'psu_spent' => $psu->price ?? 0
      ],
      'compatibility' => [
        'cpu_socket' => $cpu->socket,
        'mobo_socket' => $mobo->socket,
        'socket_match' => $cpu->socket === $mobo->socket,
        'mobo_memory_type' => $mobo->memory_type,
        'ram_memory_type' => $ram->memory_type,
        'memory_type_match' => $mobo->memory_type === $ram->memory_type
      ]
    ]);
  }

  protected function calculateBudgetAllocations($budget)
  {
    if ($budget < 600) {
      return [
        'cpu' => $budget * 0.30,
        'mobo' => $budget * 0.15,
        'ram' => $budget * 0.12,
        'gpu' => $budget * 0.25,
        'ssd' => $budget * 0.10,
        'psu' => $budget * 0.08
      ];
    } elseif ($budget < 1000) {
      return [
        'cpu' => $budget * 0.25,
        'mobo' => $budget * 0.12,
        'ram' => $budget * 0.15,
        'gpu' => $budget * 0.32,
        'ssd' => $budget * 0.08,
        'psu' => $budget * 0.08
      ];
    } elseif ($budget < 2000) {
      return [
        'cpu' => $budget * 0.22,
        'mobo' => $budget * 0.12,
        'ram' => $budget * 0.12,
        'gpu' => $budget * 0.38,
        'ssd' => $budget * 0.08,
        'psu' => $budget * 0.08
      ];
    } else {
      return [
        'cpu' => $budget * 0.20,
        'mobo' => $budget * 0.12,
        'ram' => $budget * 0.12,
        'gpu' => $budget * 0.40,
        'ssd' => $budget * 0.08,
        'psu' => $budget * 0.08
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

  protected function selectRam($mobo, $budget)
  {
    $ram = Ram::where('memory_type', $mobo->memory_type)
      ->whereNotNull('capacity')
      ->whereNotNull('price')
      ->where('capacity', '>=', 16)
      ->where('price', '<=', $budget)
      ->orderByDesc('capacity')
      ->orderByDesc('frequency')
      ->first();

    if (!$ram) {
      $ram = Ram::where('memory_type', $mobo->memory_type)
        ->whereNotNull('capacity')
        ->whereNotNull('price')
        ->where('price', '<=', $budget)
        ->orderByDesc('capacity')
        ->orderByDesc('frequency')
        ->first();
    }

    return $ram;
  }

  protected function selectGpu($budget)
  {
    return Gpu::whereNotNull('memory')
      ->whereNotNull('price')
      ->where('price', '<=', $budget)
      ->where('gpu_model', 'NOT LIKE', '%Pro%')
      ->where('gpu_model', 'NOT LIKE', '%Arc%')
      ->where('gpu_model', 'NOT LIKE', '%Quadro%')
      ->orderByDesc('memory')
      ->orderByDesc('gpu_speed')
      ->first();
  }

  protected function selectSsd($budget)
  {
    $ssd = Ssd::whereNotNull('capacity')
      ->whereNotNull('price')
      ->where('capacity', '>=', 512)
      ->where('price', '<=', $budget)
      ->orderByDesc('capacity')
      ->orderByDesc('read_speed')
      ->first();

    if (!$ssd) {
      $ssd = Ssd::whereNotNull('capacity')
        ->whereNotNull('price')
        ->where('price', '<=', $budget)
        ->orderByDesc('capacity')
        ->orderByDesc('read_speed')
        ->first();
    }

    return $ssd;
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
      ->orderBy('certification', 'desc')
      ->orderBy('wattage', 'asc')
      ->first();

    if (!$psu) {
      $psu = Psu::whereNotNull('wattage')
        ->whereNotNull('price')
        ->where('price', '<=', $budget)
        ->orderBy('certification', 'desc')
        ->orderByDesc('wattage')
        ->first();
    }

    return $psu;
  }
}
