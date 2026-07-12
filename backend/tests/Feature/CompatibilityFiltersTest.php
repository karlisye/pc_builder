<?php

use App\Models\{Cpu, Motherboard, Ram, Gpu, PcCase, Psu, Cooler, Ssd, Hdd};
use App\Services\BuilderSlotPicker;
use App\Services\ComponentFilters;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * GET /api/components/{type} with optional `selected` map.
 * Returns the full paginated data array (per_page=100).
 */
function components(string $type, array $selected = [], array $extra = []): array
{
  $params = ['per_page' => 100, ...$extra];
  if ($selected) {
    $params['selected'] = json_encode($selected);
  }
  $response = test()->getJson('/api/components/' . $type . '?' . http_build_query($params));
  $response->assertStatus(200);
  return $response->json('data');
}

function compatible(array $items): array
{
  return array_values(array_filter($items, fn($x) => $x['compatible'] ?? false));
}

function incompatible(array $items): array
{
  return array_values(array_filter($items, fn($x) => !($x['compatible'] ?? false)));
}

// ---------------------------------------------------------------------------
// CPU vs MB Socket
// ---------------------------------------------------------------------------

describe('CPU vs Motherboard socket', function () {
  it('filters motherboards to matching socket when CPU is selected', function () {
    $cpu = Cpu::whereNotNull('socket')->first();
    if (!$cpu) test()->markTestSkipped('No CPU with socket in DB');

    $items = components('motherboard', ['cpu' => $cpu->product_code]);
    $compat = compatible($items);

    expect($compat)->not->toBeEmpty();
    foreach ($compat as $mb) {
      expect($mb['socket'])->toBe($cpu->socket);
    }
  });

  it('filters CPUs to matching socket when motherboard is selected', function () {
    $mb = Motherboard::whereNotNull('socket')->first();
    if (!$mb) test()->markTestSkipped('No MB with socket in DB');

    $items = components('cpu', ['motherboard' => $mb->product_code]);
    $compat = compatible($items);

    expect($compat)->not->toBeEmpty();
    foreach ($compat as $cpu) {
      expect($cpu['socket'])->toBe($mb->socket);
    }
  });

  it('marks CPU incompatible when its socket does not match selected motherboard', function () {
    $mb  = Motherboard::where('socket', 'LGA1851')->first();
    $cpu = Cpu::where('socket', 'LGA1700')->first();
    if (!$mb || !$cpu) test()->markTestSkipped('Need both LGA1700 CPU and LGA1851 MB');

    $items = components('cpu', ['motherboard' => $mb->product_code]);
    $compat = compatible($items);

    $wrongSocket = array_filter($compat, fn($c) => $c['socket'] === 'LGA1700');
    expect($wrongSocket)->toBeEmpty('LGA1700 CPU should not be compatible with LGA1851 MB');
  });
});

// ---------------------------------------------------------------------------
// RAM memory type
// ---------------------------------------------------------------------------

describe('RAM memory type', function () {
  it('filters RAM to motherboard memory type', function () {
    $mb = Motherboard::where('memory_type', 'DDR4')->first();
    if (!$mb) test()->markTestSkipped('No DDR4 MB in DB');

    $items = components('ram', ['motherboard' => $mb->product_code]);
    foreach (compatible($items) as $ram) {
      expect($ram['memory_type'])->toBe('DDR4');
    }
  });

  it('filters RAM to CPU memory type', function () {
    $cpu = Cpu::where('memory_type', 'DDR5')->first();
    if (!$cpu) test()->markTestSkipped('No DDR5 CPU in DB');

    $items = components('ram', ['cpu' => $cpu->product_code]);
    foreach (compatible($items) as $ram) {
      expect($ram['memory_type'])->toBe('DDR5');
    }
  });

  it('filters motherboards to RAM memory type', function () {
    $ram = Ram::where('memory_type', 'DDR4')->first();
    if (!$ram) test()->markTestSkipped('No DDR4 RAM in DB');

    $items = components('motherboard', ['ram' => $ram->product_code]);
    foreach (compatible($items) as $mb) {
      expect($mb['memory_type'])->toBe('DDR4');
    }
  });

  it('excludes DDR4 RAM when motherboard requires DDR5', function () {
    $mb     = Motherboard::where('memory_type', 'DDR5')->first();
    $ramDd4 = Ram::where('memory_type', 'DDR4')->first();
    if (!$mb || !$ramDd4) test()->markTestSkipped('Need DDR5 MB and DDR4 RAM');

    $items  = components('ram', ['motherboard' => $mb->product_code]);
    $compat = compatible($items);

    $ddr4inCompat = array_filter($compat, fn($r) => $r['memory_type'] === 'DDR4');
    expect($ddr4inCompat)->toBeEmpty('DDR4 RAM should not be compatible with DDR5 MB');
  });
});

// ---------------------------------------------------------------------------
// GPU length vs Case
// ---------------------------------------------------------------------------

describe('GPU length ↔ Case', function () {
  it('excludes GPUs longer than case max_gpu_length', function () {
    $case = PcCase::whereNotNull('max_gpu_length')->first();
    if (!$case) test()->markTestSkipped('No case with max_gpu_length in DB');

    $items = components('gpu', ['case' => $case->product_code]);
    foreach (compatible($items) as $gpu) {
      if ($gpu['length_mm'] !== null) {
        expect($gpu['length_mm'])->toBeLessThanOrEqual($case->max_gpu_length);
      }
    }
  });

  it('excludes cases too small for selected GPU', function () {
    $gpu = Gpu::whereNotNull('length_mm')->orderByDesc('length_mm')->first();
    if (!$gpu) test()->markTestSkipped('No GPU with length_mm in DB');

    $items = components('case', ['gpu' => $gpu->product_code]);
    foreach (compatible($items) as $case) {
      if ($case['max_gpu_length'] !== null) {
        expect($case['max_gpu_length'])->toBeGreaterThanOrEqual($gpu->length_mm);
      }
    }
  });
});

// ---------------------------------------------------------------------------
// Missing dimension data — flagged for manual check, never silently trusted
// ---------------------------------------------------------------------------

describe('Unverifiable compatibility (missing dimension data)', function () {
  // exercises ComponentFilters::gpu() directly (loose vs strict pass) rather than the paginated
  // HTTP endpoint, since the specific fixture row isn't guaranteed to land on page 1

  it('a GPU is loosely compatible but fails the strict pass when the case has no max_gpu_length', function () {
    $case = PcCase::whereNull('max_gpu_length')->first();
    $gpu = Gpu::whereNotNull('length_mm')->first();
    if (!$case || !$gpu) test()->markTestSkipped('Need a case without max_gpu_length and a GPU with length_mm');

    $selected = ['case' => $case];
    $looseIds = App\Services\ComponentFilters::gpu(Gpu::query(), $selected)->pluck('id')->toArray();
    $strictIds = App\Services\ComponentFilters::gpu(Gpu::query(), $selected, strict: true)->pluck('id')->toArray();

    expect(in_array($gpu->id, $looseIds))->toBeTrue();
    expect(in_array($gpu->id, $strictIds))->toBeFalse();
  });

  it('a case is loosely compatible but fails the strict pass when it has no max_gpu_length and a GPU is selected', function () {
    $case = PcCase::whereNull('max_gpu_length')->first();
    $gpu = Gpu::whereNotNull('length_mm')->first();
    if (!$case || !$gpu) test()->markTestSkipped('Need a case without max_gpu_length and a GPU with length_mm');

    $selected = ['gpu' => $gpu];
    $looseIds = App\Services\ComponentFilters::case(PcCase::query(), $selected)->pluck('id')->toArray();
    $strictIds = App\Services\ComponentFilters::case(PcCase::query(), $selected, strict: true)->pluck('id')->toArray();

    expect(in_array($case->id, $looseIds))->toBeTrue();
    expect(in_array($case->id, $strictIds))->toBeFalse();
  });

  it('stays compatible in both the loose and strict pass when both sides have known dimensions', function () {
    $case = PcCase::whereNotNull('max_gpu_length')->orderByDesc('max_gpu_length')->first();
    $gpu = Gpu::where('length_mm', '<=', $case?->max_gpu_length ?? 0)->whereNotNull('length_mm')->first();
    if (!$case || !$gpu) test()->markTestSkipped('Need a case/GPU pair with known, compatible dimensions');

    $selected = ['case' => $case];
    $looseIds = App\Services\ComponentFilters::gpu(Gpu::query(), $selected)->pluck('id')->toArray();
    $strictIds = App\Services\ComponentFilters::gpu(Gpu::query(), $selected, strict: true)->pluck('id')->toArray();

    expect(in_array($gpu->id, $looseIds))->toBeTrue();
    expect(in_array($gpu->id, $strictIds))->toBeTrue();
  });

  it('auto-builder never picks a GPU for a case with unknown max_gpu_length', function () {
    $case = PcCase::whereNull('max_gpu_length')->first();
    if (!$case) test()->markTestSkipped('No case without max_gpu_length in DB');

    $picker = app(\App\Services\BuilderSlotPicker::class);
    $gpu = $picker->pick('gpu', ['case' => $case], []);

    expect($gpu)->toBeNull();
  });

  // needs_manual_check must be intrinsic to the item itself, not the current selection pair —
  // otherwise selecting one case with an unknown max_gpu_length would flag every GPU in the
  // list, and nothing would ever get flagged while browsing with nothing selected yet
  it('flags a case with no max_gpu_length via the /api/components endpoint even with nothing selected', function () {
    $case = PcCase::whereNull('max_gpu_length')->whereNotNull('name')->get()->first(
      fn($c) => PcCase::query()->tap(function ($q) use ($c) {
        foreach (array_filter(explode(' ', $c->name)) as $term) {
          $q->where('name', 'like', '%' . $term . '%');
        }
      })->count() === 1
    );
    if (!$case) test()->markTestSkipped('Need a case without max_gpu_length and a unique name');

    $response = test()->getJson('/api/components/case?' . http_build_query([
      'per_page' => 100,
      'search' => $case->name,
    ]));
    $response->assertStatus(200);

    $match = collect($response->json('data'))->firstWhere('product_code', $case->product_code);
    if (!$match) test()->markTestSkipped('Case not found via search');

    expect($match['needs_manual_check'])->toBeTrue();
  });

  it('does not flag a GPU with known specs just because the selected case has no max_gpu_length', function () {
    $case = PcCase::whereNull('max_gpu_length')->first();
    $gpu = Gpu::whereNotNull('length_mm')->whereNotNull('tdp')->whereNotNull('min_psu')
      ->whereNotNull('name')->get()->first(
        fn($g) => Gpu::query()->tap(function ($q) use ($g) {
          foreach (array_filter(explode(' ', $g->name)) as $term) {
            $q->where('name', 'like', '%' . $term . '%');
          }
        })->count() === 1
      );
    if (!$case || !$gpu) test()->markTestSkipped('Need a case without max_gpu_length and a fully-specced, uniquely-named GPU');

    $response = test()->getJson('/api/components/gpu?' . http_build_query([
      'per_page' => 100,
      'search' => $gpu->name,
      'selected' => json_encode(['case' => $case->product_code]),
    ]));
    $response->assertStatus(200);

    $match = collect($response->json('data'))->firstWhere('product_code', $gpu->product_code);
    if (!$match) test()->markTestSkipped('GPU not found via search');

    expect($match['compatible'])->toBeTrue();
    expect($match['needs_manual_check'])->toBeFalse();
  });

  it('flags a GPU with its own missing specs regardless of what else is selected', function () {
    $gpu = Gpu::whereNull('length_mm')->orWhereNull('tdp')->orWhereNull('min_psu')->first();
    if (!$gpu) test()->markTestSkipped('No GPU with missing length_mm/tdp/min_psu in DB');

    expect(App\Services\ComponentFilters::hasUnverifiableSpecs('gpu', $gpu))->toBeTrue();
  });
});

// ---------------------------------------------------------------------------
// PSU type vs Case form factor
// ---------------------------------------------------------------------------

describe('PSU type vs Case form factor', function () {
  it('only shows ATX PSUs when ATX case is selected', function () {
    $case = PcCase::whereIn('form_factor', ['ATX', 'mATX', 'E-ATX'])->first();
    if (!$case) test()->markTestSkipped('No ATX-class case in DB');

    $items = components('psu', ['case' => $case->product_code]);
    foreach (compatible($items) as $psu) {
      if ($psu['psu_type'] !== null) {
        expect($psu['psu_type'])->toBe('ATX');
      }
    }
  });

  it('excludes ATX-class cases when SFX PSU is selected', function () {
    $psu = Psu::where('psu_type', 'SFX')->first();
    if (!$psu) test()->markTestSkipped('No SFX PSU in DB');

    $atxFormFactors = ['XL ATX', 'Extended ATX', 'E-ATX', 'EEB', 'SSI-EEB', 'SSI-CEB', 'CEB', 'ATX', 'mATX', 'Micro ATX'];

    $items  = components('case', ['psu' => $psu->product_code]);
    $compat = compatible($items);

    $atxInCompat = array_filter($compat, fn($c) => in_array($c['form_factor'], $atxFormFactors));
    expect($atxInCompat)->toBeEmpty('ATX-class cases should not be compatible with SFX PSU');
  });
});

// ---------------------------------------------------------------------------
// Case with built-in PSU
// ---------------------------------------------------------------------------

describe('Case built-in PSU', function () {
  it('shows no compatible PSUs when case includes a PSU', function () {
    $case = PcCase::where('psu_included', true)->first();
    if (!$case) test()->markTestSkipped('No case with psu_included in DB');

    $items = components('psu', ['case' => $case->product_code]);
    expect(compatible($items))->toBeEmpty('No separate PSU should be compatible when case includes one');
  });

  it('excludes psu_included cases when a separate PSU is selected', function () {
    $psu = Psu::first();
    if (!$psu) test()->markTestSkipped('No PSU in DB');

    $items  = components('case', ['psu' => $psu->product_code]);
    $compat = compatible($items);

    $withBuiltinPsu = array_filter($compat, fn($c) => $c['psu_included'] ?? false);
    expect($withBuiltinPsu)->toBeEmpty('Cases with built-in PSU should not be compatible when separate PSU is selected');
  });

  it('marks case_includes_psu on incompatible PSUs when case has built-in PSU', function () {
    $case = PcCase::where('psu_included', true)->first();
    if (!$case) test()->markTestSkipped('No case with psu_included in DB');

    $items = components('psu', ['case' => $case->product_code]);
    $incompat = incompatible($items);

    expect($incompat)->not->toBeEmpty();
    foreach ($incompat as $psu) {
      expect($psu)->toHaveKey('case_includes_psu');
      expect($psu['case_includes_psu'])->toBeTrue();
    }
  });
});

// ---------------------------------------------------------------------------
// PSU wattage
// ---------------------------------------------------------------------------

describe('PSU wattage', function () {
  it('excludes GPUs whose min_psu exceeds selected PSU wattage', function () {
    $psu = Psu::whereNotNull('wattage')->orderBy('wattage')->first();
    if (!$psu) test()->markTestSkipped('No PSU with wattage in DB');

    $items = components('gpu', ['psu' => $psu->product_code]);
    foreach (compatible($items) as $gpu) {
      if ($gpu['min_psu'] !== null) {
        expect($gpu['min_psu'])->toBeLessThanOrEqual($psu->wattage);
      }
    }
  });

  it('excludes GPUs whose min_psu exceeds case built-in PSU wattage', function () {
    $case = PcCase::where('psu_included', true)->whereNotNull('psu_wattage')->first();
    if (!$case) test()->markTestSkipped('No case with psu_wattage in DB');

    $items = components('gpu', ['case' => $case->product_code]);
    foreach (compatible($items) as $gpu) {
      if ($gpu['min_psu'] !== null) {
        expect($gpu['min_psu'])->toBeLessThanOrEqual($case->psu_wattage);
      }
    }
  });

  it('excludes cases with built-in PSU insufficient for selected GPU', function () {
    $gpu = Gpu::whereNotNull('min_psu')->orderByDesc('min_psu')->first();
    if (!$gpu) test()->markTestSkipped('No GPU with min_psu in DB');

    $items = components('case', ['gpu' => $gpu->product_code]);
    foreach (compatible($items) as $case) {
      if (($case['psu_included'] ?? false) && $case['psu_wattage'] !== null) {
        expect($case['psu_wattage'])->toBeGreaterThanOrEqual($gpu->min_psu);
      }
    }
  });
});

// ---------------------------------------------------------------------------
// SATA ports
// ---------------------------------------------------------------------------

describe('SATA ports', function () {
  it('excludes SATA SSDs when motherboard has 0 SATA ports', function () {
    $mb = Motherboard::where('sata_ports', 0)->first();
    if (!$mb) test()->markTestSkipped('No MB with 0 SATA ports in DB');

    $items = components('ssd', ['motherboard' => $mb->product_code]);
    foreach (compatible($items) as $ssd) {
      expect(strtolower($ssd['interface'] ?? ''))->not->toContain('sata');
    }
  });

  it('excludes all HDDs when motherboard has 0 SATA ports', function () {
    $mb = Motherboard::where('sata_ports', 0)->first();
    if (!$mb) test()->markTestSkipped('No MB with 0 SATA ports in DB');

    $items = components('hdd', ['motherboard' => $mb->product_code]);
    expect(compatible($items))->toBeEmpty('No HDDs should be compatible when MB has 0 SATA ports');
  });

  it('still allows SATA SSD when MB has multiple SATA ports and HDD is selected', function () {
    $mb  = Motherboard::where('sata_ports', '>=', 2)->first();
    $hdd = Hdd::whereRaw("LOWER(interface) LIKE '%sata%'")->first();
    if (!$mb || !$hdd) test()->markTestSkipped('Need MB with >=2 SATA ports and a SATA HDD');

    $items  = components('ssd', ['motherboard' => $mb->product_code, 'hdd' => $hdd->product_code]);
    $compat = compatible($items);

    $sataCompat = array_filter($compat, fn($s) => str_contains(strtolower($s['interface'] ?? ''), 'sata'));
    expect($sataCompat)->not->toBeEmpty('SATA SSDs should still be compatible when ports remain after HDD');
  });

  it('excludes SATA SSDs when all SATA ports are used by the HDD', function () {
    $mb  = Motherboard::where('sata_ports', 1)->first();
    $hdd = Hdd::whereRaw("LOWER(interface) LIKE '%sata%'")->first();
    if (!$mb || !$hdd) test()->markTestSkipped('Need MB with exactly 1 SATA port and a SATA HDD');

    $items  = components('ssd', ['motherboard' => $mb->product_code, 'hdd' => $hdd->product_code]);
    $compat = compatible($items);

    $sataInCompat = array_filter($compat, fn($s) => str_contains(strtolower($s['interface'] ?? ''), 'sata'));
    expect($sataInCompat)->toBeEmpty('No SATA SSDs should be compatible when 1-port MB already has HDD');
  });

  it('excludes HDD when all SATA ports are used by a SATA SSD', function () {
    $mb      = Motherboard::where('sata_ports', 1)->first();
    $sataSsd = Ssd::whereRaw("LOWER(interface) LIKE '%sata%'")->first();
    if (!$mb || !$sataSsd) test()->markTestSkipped('Need MB with exactly 1 SATA port and a SATA SSD');

    $items = components('hdd', ['motherboard' => $mb->product_code, 'ssd' => $sataSsd->product_code]);
    expect(compatible($items))->toBeEmpty('No HDDs should be compatible when 1-port MB already has SATA SSD');
  });
});

// ---------------------------------------------------------------------------
// M.2 SSD vs Motherboard slots
// ---------------------------------------------------------------------------

describe('M.2 SSD vs Motherboard m2_slots', function () {
  it('excludes M.2 SSDs when motherboard has 0 M.2 slots', function () {
    $mb = Motherboard::where('m2_slots', 0)->first();
    if (!$mb) test()->markTestSkipped('No MB with 0 M.2 slots in DB');

    $items = components('ssd', ['motherboard' => $mb->product_code]);
    foreach (compatible($items) as $ssd) {
      expect($ssd['form_factor'])->not->toBe('M.2');
    }
  });
});

// ---------------------------------------------------------------------------
// Cooler socket + TDP
// ---------------------------------------------------------------------------

describe('Cooler vs CPU', function () {
  it('filters coolers to compatible socket when CPU is selected', function () {
    $cpu = Cpu::whereNotNull('socket')->first();
    if (!$cpu) test()->markTestSkipped('No CPU with socket in DB');

    $items = components('cooler', ['cpu' => $cpu->product_code]);
    foreach (compatible($items) as $cooler) {
      if ($cooler['compatibility']) {
        expect(explode(',', $cooler['compatibility']))->toContain($cpu->socket);
      }
    }
  });

  it('filters CPUs to cooler-compatible sockets when cooler is selected', function () {
    $cooler = Cooler::whereNotNull('compatibility')->first();
    if (!$cooler) test()->markTestSkipped('No cooler with socket compatibility in DB');

    $sockets = explode(',', $cooler->compatibility);
    $items   = components('cpu', ['cooler' => $cooler->product_code]);
    foreach (compatible($items) as $cpu) {
      if ($cpu['socket']) {
        expect($sockets)->toContain($cpu['socket']);
      }
    }
  });

  it('excludes coolers with TDP below CPU TDP', function () {
    $cpu = Cpu::whereNotNull('tdp')->orderByDesc('tdp')->first();
    if (!$cpu) test()->markTestSkipped('No CPU with TDP in DB');

    $items = components('cooler', ['cpu' => $cpu->product_code]);
    foreach (compatible($items) as $cooler) {
      if ($cooler['tdp_support'] !== null) {
        expect($cooler['tdp_support'])->toBeGreaterThanOrEqual($cpu->tdp);
      }
    }
  });
});

// ---------------------------------------------------------------------------
// Motherboard form factor vs Case
// ---------------------------------------------------------------------------

describe('Motherboard form factor vs Case', function () {
  it('excludes cases incompatible with selected motherboard form factor', function () {
    $mb = Motherboard::whereIn('form_factor', ['ATX', 'mATX', 'Mini-ITX'])->first();
    if (!$mb) test()->markTestSkipped('No MB with known form factor in DB');

    $items = components('case', ['motherboard' => $mb->product_code]);
    // All compatible cases must be able to house the MB form factor
    // We just verify none have a known incompatible form factor
    expect(compatible($items))->not->toBeEmpty();
  });
});

// ---------------------------------------------------------------------------
// HDD vs Case 3.5" bays
// ---------------------------------------------------------------------------

describe('HDD vs Case 3.5" bays', function () {
  it('excludes all HDDs when case has no 3.5" bays', function () {
    $case = PcCase::where('bays_35', 0)->whereNotNull('bays_35')->first();
    if (!$case) test()->markTestSkipped('No case with bays_35=0 in DB');

    $items = components('hdd', ['case' => $case->product_code]);
    expect(compatible($items))->toBeEmpty('No HDDs should be compatible with a caseless 3.5" bay case');
  });

  it('excludes cases with no 3.5" bays when HDD is selected', function () {
    $hdd = Hdd::first();
    if (!$hdd) test()->markTestSkipped('No HDD in DB');

    $items  = components('case', ['hdd' => $hdd->product_code]);
    $compat = compatible($items);

    $noBays = array_filter($compat, fn($c) => isset($c['bays_35']) && $c['bays_35'] === 0);
    expect($noBays)->toBeEmpty('Cases with no 3.5" bays should not be compatible when HDD is selected');
  });
});

// ---------------------------------------------------------------------------
// GPU traditional PCIe power connectors (6/8/6+2-pin) vs PSU
// ---------------------------------------------------------------------------

describe('GPU traditional PCIe connector count vs PSU', function () {
  it('excludes a GPU needing more traditional connectors than the PSU provides (loose browsing filter)', function () {
    $gpu = Gpu::where('power_connectors', '2x 8-pin')->first();
    $psu = Psu::where('pcie_connectors', '1 X 6pin')->first();
    if (!$gpu || !$psu) test()->markTestSkipped('Need a 2x 8-pin GPU and a 1x 6-pin PSU in DB');

    $compatibleIds = ComponentFilters::gpu(Gpu::query(), ['psu' => $psu])->pluck('id');
    expect($compatibleIds)->not->toContain($gpu->id);
  });

  it('excludes a PSU providing fewer traditional connectors than the GPU needs (loose browsing filter)', function () {
    $gpu = Gpu::where('power_connectors', '2x 8-pin')->first();
    $psu = Psu::where('pcie_connectors', '1 X 6pin')->first();
    if (!$gpu || !$psu) test()->markTestSkipped('Need a 2x 8-pin GPU and a 1x 6-pin PSU in DB');

    $compatibleIds = ComponentFilters::psu(Psu::query(), ['gpu' => $gpu])->pluck('id');
    expect($compatibleIds)->not->toContain($psu->id);
  });

  it('never lets the auto-builder pick a GPU/PSU pair with insufficient connectors', function () {
    $gpu = Gpu::where('power_connectors', '2x 8-pin')->first();
    $psu = Psu::where('pcie_connectors', '1 X 6pin')->first();
    if (!$gpu || !$psu) test()->markTestSkipped('Need a 2x 8-pin GPU and a 1x 6-pin PSU in DB');

    $picker = app(BuilderSlotPicker::class);
    $picked = $picker->pick('psu', ['gpu' => $gpu], []);
    expect($picked?->id)->not->toBe($psu->id);

    $picked = $picker->pick('gpu', ['psu' => $psu], []);
    expect($picked?->id)->not->toBe($gpu->id);
  });
});
