<?php

use App\Models\Cpu;
use App\Models\Gpu;
use App\Models\Motherboard;
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
  $cpu = Cpu::where('price', '>', 400)->whereNotNull('price')->first();

  if (!$cpu) {
    test()->markTestSkipped('No CPU over €400 found in DB');
  }

  generate(basePayload(300, ['type' => 'office'], ['cpu' => $cpu->dateks_id]))
    ->assertStatus(400)
    ->assertJsonPath('success', false);
});

// preferences
it('nvidia preference returns nvidia gpu', function () {
  $res = generate(basePayload(1200, ['type' => 'gaming', 'gpu' => 'nvidia']))
    ->assertStatus(200)
    ->assertJsonPath('success', true);

  expect($res->json('build.gpu.type'))->toBe('nvidia');
});

it('amd preference returns amd gpu', function () {
  $res = generate(basePayload(1200, ['type' => 'gaming', 'gpu' => 'amd']))
    ->assertStatus(200)
    ->assertJsonPath('success', true);

  expect($res->json('build.gpu.type'))->toBe('amd');
});

it('amd cpu preference returns amd cpu', function () {
  $res = generate(basePayload(1000, ['type' => 'gaming', 'cpu' => 'amd']))
    ->assertStatus(200)
    ->assertJsonPath('success', true);

  expect($res->json('build.cpu.type'))->toBe('amd');
});

it('intel cpu preference returns intel cpu', function () {
  $res = generate(basePayload(1000, ['type' => 'gaming', 'cpu' => 'intel']))
    ->assertStatus(200)
    ->assertJsonPath('success', true);

  expect($res->json('build.cpu.type'))->toBe('intel');
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
  $ram = Ram::where('capacity', '<', 8)->where('memory_type', 'DDR4')->whereNotNull('price')->first();

  if (!$ram) {
    test()->markTestSkipped('No low capacity RAM found in DB');
  }

  $res = generate(basePayload(2000, ['type' => 'gaming'], ['ram' => $ram->dateks_id]))
    ->assertStatus(200);

  $hasRamWarning = collect($res->json('warnings'))
    ->contains(fn($w) => str_contains(strtolower($w), 'ram'));

  expect($hasRamWarning)->toBeTrue();
});

it('low ram on specific type triggers warning', function () {
  $ram = Ram::where('capacity', '<', 32)->where('memory_type', 'DDR5')->whereNotNull('price')->first();

  if (!$ram) {
    test()->markTestSkipped('No 32GB RAM found in DB');
  }

  $res = generate(basePayload(2000, ['type' => 'rendering'], ['ram' => $ram->dateks_id]))
    ->assertStatus(200);

  $hasRamWarning = collect($res->json('warnings'))
    ->contains(fn($w) => str_contains(strtolower($w), 'ram'));

  expect($hasRamWarning)->toBeTrue();
});

it('low vram triggers warning', function () {
  $gpu = Gpu::where('vram', '<', 8)->whereNotNull('price')->first();

  if (!$gpu) {
    test()->markTestSkipped('No low vram GPU found in DB');
  }

  $res = generate(basePayload(1200, ['type' => 'gaming'], ['gpu' => $gpu->dateks_id]))
    ->assertStatus(200);

  $hasRamWarning = collect($res->json('warnings'))
    ->contains(fn($w) => str_contains(strtolower($w), 'gpu vram'));

  expect($hasRamWarning)->toBeTrue();
});

it('low storage triggers warning', function () {
  $ssd = Ssd::where('capacity', '<', 256)->whereNotNull('price')->where('price', '<', '200')->first();

  if (!$ssd) {
    test()->markTestSkipped('No low capacity SSD found in DB');
  }

  $res = generate(basePayload(1200, ['type' => 'gaming'], ['ssd' => $ssd->dateks_id]))
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
  generate(basePayload(1000, ['type' => 'gaming'], ['cpu' => 999999]))
    ->assertStatus(400);
});

it('incompatible components returns 400', function () {
  $ram = Ram::where('memory_type', 'DDR5')->whereNotNull('price')->first();
  $motherboard = Motherboard::where('memory_type', 'DDR4')->whereNotNull('price')->first();

  generate(basePayload(1000, ['type' => 'gaming'], ['ram' => $ram->id, 'motherboard' => $motherboard->id]))
    ->assertStatus(400);
});
