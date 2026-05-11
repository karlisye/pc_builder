<?php

namespace App\Services;

use Illuminate\Database\Eloquent\Model;

class ComponentScorer
{
  // per type contributions (sum to 10)
  private const CPU_WEIGHTS = [
    'gaming'    => ['passmark' => 1.5, 'perCore' => 4.5, 'cores' => 0.5, 'clock' => 2.5, 'efficiency' => 1.0],
    'office'    => ['passmark' => 2.0, 'perCore' => 2.0, 'cores' => 1.0, 'clock' => 1.0, 'efficiency' => 4.0],
    'rendering' => ['passmark' => 2.5, 'perCore' => 1.0, 'cores' => 4.5, 'clock' => 1.0, 'efficiency' => 1.0],
    'streaming' => ['passmark' => 2.0, 'perCore' => 1.5, 'cores' => 4.0, 'clock' => 1.5, 'efficiency' => 1.0],
  ];

  private const GPU_WEIGHTS = [
    'gaming'    => ['vram' => 2.5, 'bandwidth' => 3.0, 'cuda' => 3.0, 'efficiency' => 1.5],
    'office'    => ['vram' => 4.0, 'bandwidth' => 2.0, 'cuda' => 2.0, 'efficiency' => 2.0],
    'rendering' => ['vram' => 5.5, 'bandwidth' => 2.5, 'cuda' => 1.5, 'efficiency' => 0.5],
    'streaming' => ['vram' => 2.5, 'bandwidth' => 3.0, 'cuda' => 3.5, 'efficiency' => 1.0],
  ];

  private const RAM_WEIGHTS = [
    'gaming'    => ['capacity' => 3.0, 'bandwidth' => 4.0, 'latency' => 3.0],
    'office'    => ['capacity' => 5.0, 'bandwidth' => 2.5, 'latency' => 2.5],
    'rendering' => ['capacity' => 5.5, 'bandwidth' => 3.0, 'latency' => 1.5],
    'streaming' => ['capacity' => 4.0, 'bandwidth' => 3.5, 'latency' => 2.5],
  ];

  // normalization ranges
  private const CPU_RANGES = [
    'passmark'   => ['min' => 7000,  'max' => 175500],
    'perCore'    => ['min' => 1484,  'max' => 5542],   // passmark / cores
    'cores'      => ['min' => 4,     'max' => 96],
    'clock'      => ['min' => 4.0,   'max' => 6.2],    // GHz turbo
    'efficiency' => ['min' => 107,   'max' => 1214],   // passmark / tdp
  ];

  private const GPU_RANGES = [
    'vram'       => ['min' => 1,    'max' => 96],      // GB
    'bandwidth'  => ['min' => 8,    'max' => 3584],    // GB/s
    'cuda'       => ['min' => 16,   'max' => 24064],
    'efficiency' => ['min' => 0.52, 'max' => 12.36],  // GB/s per watt
  ];

  private const RAM_RANGES = [
    'capacity'  => ['min' => 4,    'max' => 192],    // GB
    'bandwidth' => ['min' => 21,   'max' => 141],    // GB/s
    'latency'   => ['min' => 8.3,  'max' => 20.0],  // ns (lower is better)
  ];

  private const SSD_RANGES = [
    'capacity' => ['min' => 64,  'max' => 8000],  // GB
    'read'     => ['min' => 95,  'max' => 14900], // MB/s
    'write'    => ['min' => 60,  'max' => 14000], // MB/s
  ];

  public function score(string $slot, Model $item, array $preferences = []): float
  {
    $type = $preferences['type'] ?? 'gaming';

    return match ($slot) {
      'cpu' => $this->scoreCpu($item, $type),
      'gpu' => $this->scoreGpu($item, $type),
      'ram' => $this->scoreRam($item, $type),
      'ssd' => $this->scoreSsd($item),
      default => (float) ($item->price ?? 0),
    };
  }

  // normalize a value to 0-1 based on known min/max range
  private function normalize(float $value, float $min, float $max): float
  {
    if ($max <= $min) return 0.0;
    return min(max(($value - $min) / ($max - $min), 0.0), 1.0);
  }

  // normalize where lower is better (latency)
  private function normalizeInverse(float $value, float $min, float $max): float
  {
    return 1.0 - $this->normalize($value, $min, $max);
  }

  private function scoreCpu(Model $item, string $type): float
  {
    $passmark = (float)  ($item->passmark ?? 0);
    $cores    = (float)  ($item->cores ?? 0);
    $tdp      = (float)  ($item->tdp ?? 0);
    $clock    = (float)  ($item->turbo_frequency ?? 0);
    $name     = (string) ($item->name ?? '');

    if ($passmark <= 0) {
      return 0.0;
    }

    $r = self::CPU_RANGES;

    $passmarkNorm   = $this->normalize($passmark, $r['passmark']['min'], $r['passmark']['max']);
    $perCoreNorm    = $cores > 0
      ? $this->normalize($passmark / $cores, $r['perCore']['min'], $r['perCore']['max'])
      : 0.0;
    $coresNorm      = $this->normalize($cores, $r['cores']['min'], $r['cores']['max']);
    $clockNorm      = $this->normalize($clock, $r['clock']['min'], $r['clock']['max']);
    $efficiencyNorm = $tdp > 0
      ? $this->normalize($passmark / $tdp, $r['efficiency']['min'], $r['efficiency']['max'])
      : 0.0;

    $archMultiplier = match (true) {
      // Ryzen 9xxx/8xxx series + Intel 14th-15th gen + Ultra 200
      (bool) preg_match('/Ryzen\s+\d+\s+[98]\d{3}|Ultra\s+[5-9]\s+2\d{2}|i[3579]-1[45]\d{3}/i', $name) => 1.20,
      // Ryzen 7xxx series + Intel 12th-13th gen
      (bool) preg_match('/Ryzen\s+\d+\s+7\d{3}|i[3579]-1[23]\d{3}/i', $name) => 1.10,
      // Ryzen 5xxx series + Intel 10th-11th gen
      (bool) preg_match('/Ryzen\s+\d+\s+5\d{3}|i[3579]-1[01]\d{3}/i', $name) => 1.05,
      // Ryzen 3xxx/4xxx series + Intel 8th-9th gen
      (bool) preg_match('/Ryzen\s+\d+\s+[34]\d{3}|i[3579]-[89]\d{3}/i', $name) => 1.01,
      default => 0.97,
    };

    $w = self::CPU_WEIGHTS[$type] ?? self::CPU_WEIGHTS['gaming'];

    $raw = (
      $passmarkNorm   * $w['passmark'] +
      $perCoreNorm    * $w['perCore'] +
      $coresNorm      * $w['cores'] +
      $clockNorm      * $w['clock'] +
      $efficiencyNorm * $w['efficiency']
    ) * $archMultiplier;

    return round(min($raw, 10.0), 2);
  }

  private function scoreGpu(Model $item, string $type): float
  {
    $vram     = (float)  ($item->vram ?? 0);
    $tdp      = (float)  ($item->tdp ?? 0);
    $vramFreq = (float)  ($item->vram_freq ?? 0);
    $bus      = (float)  ($item->bus ?? 0);
    $cuda     = (float)  ($item->cuda ?? 0);
    $name     = (string) ($item->name ?? '');

    if ($vram <= 0) {
      return 0.0;
    }

    $bandwidth = ($vramFreq > 0 && $bus > 0)
      ? ($vramFreq * 2 * $bus) / 8 / 1000
      : 0.0;

    $efficiency = ($tdp > 0 && $bandwidth > 0)
      ? $bandwidth / $tdp
      : 0.0;

    $r = self::GPU_RANGES;

    $vramNorm       = $this->normalize($vram, $r['vram']['min'], $r['vram']['max']);
    $bandwidthNorm  = $this->normalize($bandwidth, $r['bandwidth']['min'], $r['bandwidth']['max']);
    $cudaNorm       = $this->normalize($cuda, $r['cuda']['min'], $r['cuda']['max']);
    $efficiencyNorm = $this->normalize($efficiency, $r['efficiency']['min'], $r['efficiency']['max']);

    $archMultiplier = match (true) {
      (bool) preg_match('/RTX\s*50|RX\s*9/i', $name)  => 1.10,
      (bool) preg_match('/RTX\s*40|RX\s*7/i', $name)  => 1.06,
      (bool) preg_match('/RTX\s*30|RX\s*6/i', $name)  => 1.03,
      (bool) preg_match('/RTX\s*20|RX\s*5/i', $name)  => 1.01,
      (bool) preg_match('/GTX\s*16/i', $name)         => 0.98,
      (bool) preg_match('/GTX\s*10/i', $name)         => 0.95,
      default                                         => 0.90,
    };

    $w = self::GPU_WEIGHTS[$type] ?? self::GPU_WEIGHTS['gaming'];

    $raw = (
      $vramNorm       * $w['vram'] +
      $bandwidthNorm  * $w['bandwidth'] +
      $cudaNorm       * $w['cuda'] +
      $efficiencyNorm * $w['efficiency']
    ) * $archMultiplier;

    return round(min($raw, 10.0), 2);
  }

  private function scoreRam(Model $item, string $type): float
  {
    $capacity  = (float) ($item->capacity ?? 0);
    $frequency = (float) ($item->frequency ?? 0);
    $latency   = (float) ($item->cl_latency ?? 0);

    if ($capacity <= 0) {
      return 0.0;
    }

    $bandwidth     = $frequency > 0 ? ($frequency * 2 * 64) / 8 / 1000 : 0.0;
    $trueLatencyNs = ($frequency > 0 && $latency > 0) ? ($latency / $frequency) * 2000 : 20.0;

    $r = self::RAM_RANGES;

    $capacityNorm  = $this->normalize($capacity, $r['capacity']['min'], $r['capacity']['max']);
    $bandwidthNorm = $this->normalize($bandwidth, $r['bandwidth']['min'], $r['bandwidth']['max']);
    $latencyNorm   = $this->normalizeInverse($trueLatencyNs, $r['latency']['min'], $r['latency']['max']);

    $w = self::RAM_WEIGHTS[$type] ?? self::RAM_WEIGHTS['gaming'];

    $raw = (
      $capacityNorm  * $w['capacity'] +
      $bandwidthNorm * $w['bandwidth'] +
      $latencyNorm   * $w['latency']
    );

    return round(min($raw, 10.0), 2);
  }

  private function scoreSsd(Model $item): float
  {
    $readSpeed  = (float) ($item->read_speed ?? 0);
    $writeSpeed = (float) ($item->write_speed ?? 0);
    $capacity   = (float) ($item->capacity ?? 0);

    if ($capacity <= 0) {
      return 0.0;
    }

    $r = self::SSD_RANGES;

    // capacity weighted most heavily since storage space is the primary concern
    $capacityNorm = $this->normalize($capacity, $r['capacity']['min'], $r['capacity']['max']);
    $readNorm     = $this->normalize($readSpeed, $r['read']['min'], $r['read']['max']);
    $writeNorm    = $this->normalize($writeSpeed, $r['write']['min'], $r['write']['max']);

    $raw = ($capacityNorm * 5.0) + ($readNorm * 3.0) + ($writeNorm * 2.0);

    return round(min($raw, 10.0), 2);
  }
}
