<?php

namespace App\Services;

use App\Helpers\CompatibilityHelper;
use App\Models\{Cpu, Motherboard, Ram, Gpu, Ssd, Hdd, PcCase, Fan, Psu, Cooler};
use Illuminate\Database\Eloquent\Model;

class BuilderSlotPicker
{
  public function pick(string $slot, float $budget, array $selected): ?Model
  {
    $modelClass = CompatibilityService::VALID_TYPES[$slot];

    $query = $modelClass::query()
      ->whereNotNull('price')
      ->where('in_stock', true)
      ->where('price', '<=', $budget);

    $query = match ($slot) {
      'cpu' => ComponentFilters::cpu($query, $selected),
      'motherboard' => ComponentFilters::motherboard($query, $selected),
      'ram' => ComponentFilters::ram($query, $selected),
      'gpu' => ComponentFilters::gpu($query, $selected),
      'case' => ComponentFilters::case($query, $selected),
      'cooler' => ComponentFilters::cooler($query, $selected),
      'psu' => ComponentFilters::psu($query, $selected),
      default => $query,
    };

    $candidates = $query->get();

    if ($candidates->isEmpty()) {
      return null;
    }

    return $candidates->sortByDesc(fn($item) => $this->score($slot, $item))->first();
  }

  public function pickMostExpensive(string $slot, array $selected): ?Model
  {
    $modelClass = CompatibilityService::VALID_TYPES[$slot];

    $query = $modelClass::query()
      ->whereNotNull('price')
      ->where('in_stock', true);

    $query = match ($slot) {
      'cpu' => ComponentFilters::cpu($query, $selected),
      'motherboard' => ComponentFilters::motherboard($query, $selected),
      'ram' => ComponentFilters::ram($query, $selected),
      'gpu' => ComponentFilters::gpu($query, $selected),
      'case' => ComponentFilters::case($query, $selected),
      'cooler' => ComponentFilters::cooler($query, $selected),
      'psu' => ComponentFilters::psu($query, $selected),
      default => $query,
    };

    return $query->orderByDesc('price')->first();
  }

  public function cheapest(string $slot, array $selected): ?Model
  {
    $modelClass = CompatibilityService::VALID_TYPES[$slot];

    $query = $modelClass::query()
      ->whereNotNull('price')
      ->where('in_stock', true);

    $query = match ($slot) {
      'cpu' => ComponentFilters::cpu($query, $selected),
      'motherboard' => ComponentFilters::motherboard($query, $selected),
      'ram' => ComponentFilters::ram($query, $selected),
      'gpu' => ComponentFilters::gpu($query, $selected),
      'case' => ComponentFilters::case($query, $selected),
      'cooler' => ComponentFilters::cooler($query, $selected),
      'psu' => ComponentFilters::psu($query, $selected),
      default => $query,
    };

    return $query->orderBy('price')->first();
  }

  public function score(string $slot, Model $item): float
  {
    return match ($slot) {
      'cpu' => $this->scoreCpu($item),
      'gpu' => $this->scoreGpu($item),
      'ram' => $this->scoreRam($item),
      'ssd' => $this->scoreSsd($item),
      default  => (float) ($item->price ?? 0),
    };
  }

  private function scoreCpu(Model $item): float
  {
    $passmark = (float) ($item->passmark ?? 0);
    $cores    = (float) ($item->cores    ?? 2);
    $tdp      = (float) ($item->tdp      ?? 0);
    $clockRate = (float) ($item->clock_rate ?? 0);
    $name     = (string) ($item->name    ?? '');

    if ($passmark <= 0) {
      return 0.0;
    }

    // 6500 = ~370, 30000 = ~600, 100000 = ~870, 175500 = ~1 000
    $passmarkScore = pow($passmark, 0.6) * 2.2;

    // ~1000 pts/core = 125, ~3000 pts/core = 215, ~6000 pts/core = 305
    $perCoreScore = 0.0;
    if ($cores > 0) {
      $perCoreScore = sqrt($passmark / $cores) * 3.5;
    }

    // 4c = 69, 8c = 97, 16c = 122, 64c = 166, 192c = 184
    $coreScore = log($cores + 1) * 50;

    // meaningful only when passmark is already competitive.
    // 3.0 GHz = 60   4.5 GHz = 90   6.0 GHz = 120
    $clockScore = 0.0;
    if ($clockRate > 0) {
      $clockScore = sqrt($clockRate) * 45;
    }

    // ~200 pts/W = 50, ~500 pts/W = 125, ~1 000 pts/W = 250
    $efficiencyScore = 0.0;
    if ($tdp > 0) {
      $efficiencyRatio = $passmark / $tdp;
      $efficiencyScore = sqrt($efficiencyRatio) * 8;
    }

    // architecture / generation multiplier
    $archMultiplier = match (true) {
      // AMD Ryzen 9000 / Intel 14th–15th gen
      (bool) preg_match('/Ryzen\s*[A-Z]?\s*9\d{3}|Ultra\s*[279]\s*2\d{2}|i[3579]-1[45]\d{3}/i', $name) => 1.30,
      // AMD Ryzen 7000 / Intel 12th–13th gen
      (bool) preg_match('/Ryzen\s*[A-Z]?\s*7\d{3}|i[3579]-1[23]\d{3}/i', $name) => 1.20,
      // AMD Ryzen 5000 / Intel 10th–11th gen
      (bool) preg_match('/Ryzen\s*[A-Z]?\s*5\d{3}|i[3579]-1[01]\d{3}/i', $name) => 1.12,
      // AMD Ryzen 3000 / Intel 8th–9th gen
      (bool) preg_match('/Ryzen\s*[A-Z]?\s*3\d{3}|i[3579]-[89]\d{3}/i', $name) => 1.05,
      default => 0.95,
    };

    $raw = ($passmarkScore + $perCoreScore + $coreScore + $clockScore + $efficiencyScore)
      * $archMultiplier;

    return round($raw, 2);
  }

  private function scoreGpu(Model $item): float
  {
    $vram = (float) ($item->vram ?? 0);
    $tdp = (float) ($item->tdp ?? 0);
    $vramFreq = (float) ($item->vram_freq ?? 0);
    $bus = (float) ($item->bus ?? 0);
    $cuda = (float) ($item->cuda ?? 0);
    $name = (string) ($item->name ?? '');

    if ($vram <= 0) {
      return 0.0;
    }

    // 4GB ≈ 339, 8GB ≈ 689, 16GB ≈ 1400, 24GB ≈ 2028
    $vramScore = pow($vram, 1.1) * 65;

    // 384-bit, 2000MHz = 192 GB/s = 288 pts
    $bandwidth  = 0.0;
    $bandwidthScore = 0.0;
    if ($vramFreq > 0 && $bus > 0) {
      $bandwidth      = ($vramFreq * 2 * $bus) / 8 / 1000; // GB/s
      $bandwidthScore = $bandwidth * 1.5;
    }

    // 2048 = 90, 4096 = 128, 10496 = 205, 16384 = 256
    $cudaScore = 0.0;
    if ($cuda > 0) {
      $cudaScore = sqrt($cuda) * 2;
    }

    $efficiencyScore = 0.0;
    if ($tdp > 0 && $bandwidth > 0) {
      $efficiencyRatio  = $bandwidth / $tdp; // GB/s per watt
      $efficiencyScore  = $efficiencyRatio * 150;
    }

    $archMultiplier = match (true) {
      (bool) preg_match('/RTX\s*50|RX\s*9/i', $name) => 1.35,
      (bool) preg_match('/RTX\s*40|RX\s*7/i', $name) => 1.30,
      (bool) preg_match('/RTX\s*30|RX\s*6/i', $name) => 1.25,
      (bool) preg_match('/RTX\s*20|RX\s*5/i', $name) => 1.20,
      (bool) preg_match('/GTX\s*16/i', $name) => 1.10,
      (bool) preg_match('/GTX\s*10/i', $name) => 1.00,
      default => 0.90,
    };

    $raw = ($vramScore + $bandwidthScore + $cudaScore + $efficiencyScore)
      * $archMultiplier;

    return round($raw, 2);
  }

  private function scoreRam(Model $item): float
  {
    $capacity  = (float) ($item->capacity ?? 0);
    $frequency = (float) ($item->frequency ?? 0);
    $latency   = (float) ($item->cl_latency ?? 0);

    // 4GB=527, 8GB=1212, 16GB=2785, 24GB=4531
    $score = pow($capacity, 1.2) * 100;

    if ($frequency > 0 && $latency > 0) {
      $trueLatency = ($latency / $frequency) * 2000;
      $score += (20 - $trueLatency) * 200; // more score if lower latency per GB
    }

    if ($frequency > 0) {
      $bandwidth = ($frequency * 2 * 64) / 8 / 1000; // GB/s
      $score += $bandwidth * 10;
    }

    return $score;
  }

  private function scoreSsd(Model $item): float
  {
    $readSpeed  = (float) ($item->read_speed ?? 0);
    $writeSpeed = (float) ($item->write_speed ?? 0);
    $capacity   = (float) ($item->capacity ?? 0);

    $score = log($capacity, 2) * 1000;

    $score += ($readSpeed * 0.6) + ($writeSpeed * 0.4);

    return $score;
  }
}
