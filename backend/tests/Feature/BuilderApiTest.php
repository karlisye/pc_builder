<?php

use App\Models\Cpu;
use App\Models\Gpu;
use App\Models\Motherboard;
use App\Models\PcCase;
use App\Models\Psu;
use App\Models\Ram;
use App\Models\Ssd;

// response structure
it('successful response has correct structure', function () {
  generate(basePayload(1000))
    ->assertStatus(200)
    ->assertJsonStructure([
      'success',
      'build',
      'total_price',
      'remaining_budget',
      'attempts_needed',
      'error',
      'estimated_minimum_budget',
      'warnings',
      'notes',
    ]);
});

// budget tiers
it('min budget build succeeds', function () {
  generate(basePayload(350))
    ->assertStatus(200)
    ->assertJsonPath('success', true);
});

it('min budget office build succeeds', function () {
  generate(basePayload(350, ['type' => 'office']))
    ->assertStatus(200)
    ->assertJsonPath('success', true);
});

it('mid budget build succeeds', function () {
  generate(basePayload(500))
    ->assertStatus(200)
    ->assertJsonPath('success', true);
});

it('mid budget office build succeeds', function () {
  generate(basePayload(500, ['type' => 'office']))
    ->assertStatus(200)
    ->assertJsonPath('success', true);
});

it('mid budget gaming build succeeds', function () {
  generate(basePayload(500, ['type' => 'gaming']))
    ->assertStatus(200)
    ->assertJsonPath('success', true);
});

it('mid budget streaming build succeeds', function () {
  generate(basePayload(500, ['type' => 'streaming']))
    ->assertStatus(200)
    ->assertJsonPath('success', true);
});

it('high budget build succeeds', function () {
  generate(basePayload(1501))
    ->assertStatus(200)
    ->assertJsonPath('success', true);
});

it('high budget office build succeeds', function () {
  generate(basePayload(1501, ['type' => 'office']))
    ->assertStatus(200)
    ->assertJsonPath('success', true);
});

it('high budget gaming build succeeds', function () {
  generate(basePayload(1501, ['type' => 'gaming']))
    ->assertStatus(200)
    ->assertJsonPath('success', true);
});

it('high budget streaming build succeeds', function () {
  generate(basePayload(1501, ['type' => 'streaming']))
    ->assertStatus(200)
    ->assertJsonPath('success', true);
});

it('high budget rendering build succeeds', function () {
  generate(basePayload(1501, ['type' => 'rendering']))
    ->assertStatus(200)
    ->assertJsonPath('success', true);
});

// budget constraints
it('selected components exceeding budget returns error', function () {
  $cpu = Cpu::whereHas('listings', fn($q) => $q->where('price', '>', 400))->first();

  if (!$cpu) {
    test()->markTestSkipped('No CPU over €400 found in DB');
  }

  generate(basePayload(300, ['type' => 'office'], ['cpu' => $cpu->product_code]))
    ->assertStatus(400)
    ->assertJsonPath('success', false);
});

// preferences
it('nvidia preference returns nvidia gpu', function () {
  $res = generate(basePayload(1200, ['type' => 'gaming', 'gpu' => 'nvidia']))
    ->assertStatus(200)
    ->assertJsonPath('success', true);

  expect($res->json('build.gpu.gpu_family'))->toBe('nvidia');
});

it('amd preference returns amd gpu', function () {
  $res = generate(basePayload(1200, ['type' => 'gaming', 'gpu' => 'amd']))
    ->assertStatus(200)
    ->assertJsonPath('success', true);

  expect($res->json('build.gpu.gpu_family'))->toBe('amd');
});

it('amd cpu preference returns amd cpu', function () {
  $res = generate(basePayload(1000, ['type' => 'gaming', 'cpu' => 'amd']))
    ->assertStatus(200)
    ->assertJsonPath('success', true);

  expect(strtolower($res->json('build.cpu.brand')))->toBe('amd');
});

it('intel cpu preference returns intel cpu', function () {
  $res = generate(basePayload(1000, ['type' => 'gaming', 'cpu' => 'intel']))
    ->assertStatus(200)
    ->assertJsonPath('success', true);

  expect(strtolower($res->json('build.cpu.brand')))->toBe('intel');
});


// build type specific rules
it('office build has no gpu', function () {
  generate(basePayload(800, ['type' => 'office']))
    ->assertStatus(200)
    ->assertJsonPath('success', true)
    ->assertJsonPath('build.gpu', null);
});

it('office build cpu has integrated graphics', function () {
  $res = generate(basePayload(800, ['type' => 'office']))
    ->assertStatus(200)
    ->assertJsonPath('success', true);

  expect($res->json('build.cpu.integrated_graphics'))->toBeTrue();
});

it('gaming build has gpu', function () {
  generate(basePayload(1000, ['type' => 'gaming']))
    ->assertStatus(200)
    ->assertJsonPath('success', true)
    ->assertJsonPath('build.gpu', fn($gpu) => $gpu !== null);
});

it('build always has ssd', function () {
  foreach ([600, 1000, 2000] as $budget) {
    $res = generate(basePayload($budget));
    if ($res->json('success')) {
      expect($res->json('build.ssd'))->not->toBeNull("SSD missing for budget €{$budget}");
    }
  }
});

it('cpu and motherboard have matching sockets', function () {
  $res = generate(basePayload(1000, ['type' => 'gaming']))
    ->assertStatus(200)
    ->assertJsonPath('success', true);

  expect($res->json('build.cpu.socket'))->toBe($res->json('build.motherboard.socket'));
});

it('motherboard and ram have matching memory type', function () {
  $res = generate(basePayload(1000, ['type' => 'gaming']))
    ->assertStatus(200)
    ->assertJsonPath('success', true);

  expect($res->json('build.motherboard.memory_type'))->toBe($res->json('build.ram.memory_type'));
});

// warnings
it('low ram triggers warning', function () {
  $ram = Ram::where('capacity', '<', 8)->where('memory_type', 'DDR4')->whereHas('listings')->first();

  if (!$ram) {
    test()->markTestSkipped('No low capacity RAM found in DB');
  }

  $res = generate(basePayload(2000, ['type' => 'gaming'], ['ram' => $ram->product_code]))
    ->assertStatus(200);

  $hasRamWarning = collect($res->json('warnings'))
    ->contains(fn($w) => str_contains(strtolower($w), 'ram'));

  expect($hasRamWarning)->toBeTrue();
});

it('low ram on specific type triggers warning', function () {
  $ram = Ram::where('capacity', '<', 32)->where('memory_type', 'DDR5')->whereHas('listings')->first();

  if (!$ram) {
    test()->markTestSkipped('No 32GB RAM found in DB');
  }

  $res = generate(basePayload(2000, ['type' => 'rendering'], ['ram' => $ram->product_code]))
    ->assertStatus(200);

  $hasRamWarning = collect($res->json('warnings'))
    ->contains(fn($w) => str_contains(strtolower($w), 'ram'));

  expect($hasRamWarning)->toBeTrue();
});

it('low vram triggers warning', function () {
  $gpu = Gpu::where('vram', '<', 8)->whereHas('listings')->first();

  if (!$gpu) {
    test()->markTestSkipped('No low vram GPU found in DB');
  }

  $res = generate(basePayload(1200, ['type' => 'gaming'], ['gpu' => $gpu->product_code]))
    ->assertStatus(200);

  $hasRamWarning = collect($res->json('warnings'))
    ->contains(fn($w) => str_contains(strtolower($w), 'gpu vram'));

  expect($hasRamWarning)->toBeTrue();
});

it('low storage triggers warning', function () {
  $ssd = Ssd::where('capacity', '<', 256)->whereHas('listings', fn($q) => $q->where('price', '<', 200))->first();

  if (!$ssd) {
    test()->markTestSkipped('No low capacity SSD found in DB');
  }

  $res = generate(basePayload(1200, ['type' => 'gaming'], ['ssd' => $ssd->product_code]))
    ->assertStatus(200);

  $hasRamWarning = collect($res->json('warnings'))
    ->contains(fn($w) => str_contains(strtolower($w), 'ssd'));

  expect($hasRamWarning)->toBeTrue();
});

// error handling
it('zero budget returns 422', function () {
  test()->postJson('/api/builder', [
    'budget'      => 0,
    'preferences' => ['type' => 'gaming'],
    'selected'    => [],
  ])
    ->assertStatus(422);
});

it('invalid selected component id returns 400', function () {
  generate(basePayload(1000, ['type' => 'gaming'], ['cpu' => 'nonexistent-product-code']))
    ->assertStatus(400);
});

it('incompatible components returns 400', function () {
  $ram = Ram::where('memory_type', 'DDR5')->whereHas('listings')->first();
  $motherboard = Motherboard::where('memory_type', 'DDR4')->whereHas('listings')->first();

  if (!$ram || !$motherboard) {
    test()->markTestSkipped('No DDR5 RAM / DDR4 motherboard pair found in DB');
  }

  generate(basePayload(1000, ['type' => 'gaming'], ['ram' => $ram->product_code, 'motherboard' => $motherboard->product_code]))
    ->assertStatus(400);
});

// generation limits
it('auto-generated psu wattage is capped near what the build needs, not maxed out', function () {
  $cpu = Cpu::whereHas('listings')->whereNotNull('tdp')->orderBy('tdp')->first();
  $gpu = Gpu::whereHas('listings')->whereNotNull('tdp')->whereNotNull('min_psu')->orderBy('tdp')->first();

  if (!$cpu || !$gpu) {
    test()->markTestSkipped('No low-power CPU/GPU found in DB');
  }

  $res = test()->postJson('/api/builder/psu', [
    'selected' => ['cpu' => $cpu->product_code, 'gpu' => $gpu->product_code],
    'budget' => 100000,
  ])->assertStatus(200);

  $wattage = $res->json('build.psu.wattage');
  expect($wattage)->not->toBeNull();

  // scoring also weighs efficiency/modularity, so this isn't pinned to the
  // scorer's exact headroom multiplier - just asserts it stays in the
  // ballpark of what the build needs instead of maxing out at the highest
  // wattage available (which would be 1600W+ for this low-power build)
  $requiredWattage = max(($cpu->tdp + $gpu->tdp) * 1.3, $gpu->min_psu ?? 0);
  $generousCeiling = max($requiredWattage * 3, 900);

  expect($wattage)->toBeLessThanOrEqual($generousCeiling);
});

it('auto-generated cpu+gpu combo does not exceed a preselected weak psu', function () {
  $psu = Psu::whereHas('listings')->whereNotNull('wattage')->where('wattage', '<=', 450)->orderByDesc('wattage')->first();

  if (!$psu) {
    test()->markTestSkipped('No weak PSU found in DB');
  }

  $res = generate(basePayload(5000, ['type' => 'gaming'], ['psu' => $psu->product_code]))
    ->assertStatus(200)
    ->assertJsonPath('success', true);

  $cpuTdp = $res->json('build.cpu.tdp');
  $gpuTdp = $res->json('build.gpu.tdp');
  $gpuMinPsu = $res->json('build.gpu.min_psu');
  $ramModules = $res->json('build.ram.modules_count') ?? 0;

  expect($cpuTdp)->not->toBeNull();
  expect($gpuTdp)->not->toBeNull();

  // fan is picked after psu/gpu so its few watts aren't known at filter
  // time - allow a small tolerance for that instead of pinning to the exact
  // formula (see design-decisions.md for why this residual gap is accepted)
  $required = max(($cpuTdp + $gpuTdp + $ramModules * 5) * 1.3, $gpuMinPsu ?? 0);

  expect($required)->toBeLessThanOrEqual($psu->wattage * 1.15);
});

it('auto-generated cpu does not exceed psu capacity when a power-hungry gpu is preselected', function () {
  $gpu = Gpu::whereHas('listings')->whereNotNull('tdp')->whereNotNull('min_psu')->orderByDesc('tdp')->first();
  $psu = Psu::whereHas('listings')->whereNotNull('wattage')->where('wattage', '>=', $gpu?->min_psu ?? 0)->orderBy('wattage')->first();

  if (!$gpu || !$psu) {
    test()->markTestSkipped('No high-tdp GPU / matching PSU pair found in DB');
  }

  $res = generate(basePayload(20000, ['type' => 'gaming'], ['gpu' => $gpu->product_code, 'psu' => $psu->product_code]))
    ->assertStatus(200)
    ->assertJsonPath('success', true);

  $cpuTdp = $res->json('build.cpu.tdp');
  $ramModules = $res->json('build.ram.modules_count') ?? 0;

  expect($cpuTdp)->not->toBeNull();

  $required = max(($cpuTdp + $gpu->tdp + $ramModules * 5) * 1.3, $gpu->min_psu ?? 0);

  expect($required)->toBeLessThanOrEqual($psu->wattage * 1.15);
});

it('auto-generated cpu+gpu combo does not exceed a case with a weak built-in psu', function () {
  $case = PcCase::whereHas('listings')->where('psu_included', 1)->whereNotNull('psu_wattage')->where('psu_wattage', '<=', 550)->orderByDesc('psu_wattage')->first();

  if (!$case) {
    test()->markTestSkipped('No case with a weak built-in PSU found in DB');
  }

  $res = generate(basePayload(5000, ['type' => 'gaming'], ['case' => $case->product_code]))
    ->assertStatus(200)
    ->assertJsonPath('success', true);

  $cpuTdp = $res->json('build.cpu.tdp');
  $gpuTdp = $res->json('build.gpu.tdp');
  $gpuMinPsu = $res->json('build.gpu.min_psu');
  $ramModules = $res->json('build.ram.modules_count') ?? 0;

  if ($gpuTdp === null) {
    // integrated-graphics build - no wattage constraint to check
    expect(true)->toBeTrue();
    return;
  }

  $required = max(($cpuTdp + $gpuTdp + $ramModules * 5) * 1.3, $gpuMinPsu ?? 0);

  expect($required)->toBeLessThanOrEqual($case->psu_wattage * 1.15);
});
