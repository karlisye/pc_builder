<?php

use App\Models\{Cpu, Motherboard, Ram, Gpu, PcCase, Psu, Cooler, Ssd, Hdd};
use App\Helpers\CompatibilityHelper;

// ---------------------------------------------------------------------------
// Helper
// ---------------------------------------------------------------------------

function validate(array $selected): \Illuminate\Testing\TestResponse
{
  return test()->postJson('/api/builder/validate', ['selected' => $selected]);
}

function hasIssue(\Illuminate\Testing\TestResponse $res, string $slot): bool
{
  return !empty($res->json("issues.{$slot}"));
}

function hasWarning(\Illuminate\Testing\TestResponse $res, string $slot): bool
{
  return !empty($res->json("warnings.{$slot}"));
}

// ---------------------------------------------------------------------------
// Response structure
// ---------------------------------------------------------------------------

describe('Response structure', function () {
  it('returns issues and warnings keys', function () {
    validate([])
      ->assertStatus(200)
      ->assertJsonStructure(['issues', 'warnings']);
  });

  it('returns empty issues and warnings for an empty build', function () {
    $res = validate([]);
    expect($res->json('issues'))->toBeEmpty();
    expect($res->json('warnings'))->toBeEmpty();
  });

  it('returns 400 for an invalid product code', function () {
    validate(['cpu' => 'DOES_NOT_EXIST'])
      ->assertStatus(400);
  });
});

// ---------------------------------------------------------------------------
// CPU vs MB socket
// ---------------------------------------------------------------------------

describe('CPU vs Motherboard socket mismatch', function () {
  it('flags cpu and motherboard when sockets do not match', function () {
    $cpu = Cpu::where('socket', 'LGA1700')->first();
    $mb  = Motherboard::where('socket', 'LGA1851')->first();
    if (!$cpu || !$mb) test()->markTestSkipped('Need both LGA1700 CPU and LGA1851 MB');

    $res = validate(['cpu' => $cpu->product_code, 'motherboard' => $mb->product_code]);
    expect(hasIssue($res, 'cpu'))->toBeTrue();
    expect(hasIssue($res, 'motherboard'))->toBeTrue();
  });

  it('has no socket issue when CPU and MB sockets match', function () {
    $cpu = Cpu::whereNotNull('socket')->first();
    $mb  = Motherboard::where('socket', $cpu->socket)->first();
    if (!$cpu || !$mb) test()->markTestSkipped('No matching CPU+MB socket pair in DB');

    $res = validate(['cpu' => $cpu->product_code, 'motherboard' => $mb->product_code]);
    expect(hasIssue($res, 'cpu'))->toBeFalse();
    expect(hasIssue($res, 'motherboard'))->toBeFalse();
  });
});

// ---------------------------------------------------------------------------
// RAM memory type
// ---------------------------------------------------------------------------

describe('RAM memory type mismatch', function () {
  it('flags ram and motherboard when memory types differ', function () {
    $mb     = Motherboard::where('memory_type', 'DDR4')->first();
    $ramDd5 = Ram::where('memory_type', 'DDR5')->first();
    if (!$mb || !$ramDd5) test()->markTestSkipped('Need DDR4 MB and DDR5 RAM');

    $res = validate(['motherboard' => $mb->product_code, 'ram' => $ramDd5->product_code]);
    expect(hasIssue($res, 'ram'))->toBeTrue();
    expect(hasIssue($res, 'motherboard'))->toBeTrue();
  });

  it('flags cpu and ram when CPU memory type does not support RAM type', function () {
    $cpu    = Cpu::where('memory_type', 'DDR5')->first();
    $ramDd4 = Ram::where('memory_type', 'DDR4')->first();
    if (!$cpu || !$ramDd4) test()->markTestSkipped('Need DDR5 CPU and DDR4 RAM');

    $res = validate(['cpu' => $cpu->product_code, 'ram' => $ramDd4->product_code]);
    expect(hasIssue($res, 'cpu'))->toBeTrue();
    expect(hasIssue($res, 'ram'))->toBeTrue();
  });
});

// ---------------------------------------------------------------------------
// RAM memory type with no supporting motherboard in stock
// ---------------------------------------------------------------------------

describe('RAM memory type with no motherboard support', function () {
  it('flags ram when its memory type has no matching motherboard in stock', function () {
    $mbTypes = Motherboard::whereNotNull('memory_type')->distinct()->pluck('memory_type');
    $ram = Ram::whereNotNull('memory_type')->whereNotIn('memory_type', $mbTypes)->first();
    if (!$ram) test()->markTestSkipped('No RAM memory type without a matching motherboard in DB');

    $res = validate(['ram' => $ram->product_code]);
    expect(hasIssue($res, 'ram'))->toBeTrue();
  });

  it('does not flag ram when a matching motherboard exists in stock, even if none is selected', function () {
    $mbTypes = Motherboard::whereNotNull('memory_type')->distinct()->pluck('memory_type');
    $ram = Ram::whereNotNull('memory_type')->whereIn('memory_type', $mbTypes)->first();
    if (!$ram) test()->markTestSkipped('No RAM memory type with a matching motherboard in DB');

    $res = validate(['ram' => $ram->product_code]);
    expect(hasIssue($res, 'ram'))->toBeFalse();
  });

  it('does not duplicate the no-stock issue once a mismatched motherboard is actually selected', function () {
    $mbTypes = Motherboard::whereNotNull('memory_type')->distinct()->pluck('memory_type');
    $ram = Ram::whereNotNull('memory_type')->whereNotIn('memory_type', $mbTypes)->first();
    $mb = Motherboard::whereNotNull('memory_type')->first();
    if (!$ram || !$mb) test()->markTestSkipped('Need unsupported RAM type and any motherboard in DB');

    $res = validate(['ram' => $ram->product_code, 'motherboard' => $mb->product_code]);
    // the direct mismatch issue should fire instead of the no-stock issue
    expect($res->json('issues.ram'))->not->toContain(
      __('compatibility.ram_no_motherboard_support', ['ram_type' => $ram->memory_type])
    );
  });
});

// ---------------------------------------------------------------------------
// RAM modules vs motherboard slots
// ---------------------------------------------------------------------------

describe('RAM modules vs MB slots', function () {
  it('flags ram and motherboard when kit has more modules than MB slots', function () {
    $mb  = Motherboard::whereNotNull('memory_slots')->orderBy('memory_slots')->first();
    $ram = Ram::where('modules_count', '>', $mb?->memory_slots ?? 0)
      ->where('memory_type', $mb?->memory_type ?? 'DDR4')
      ->whereNotNull('modules_count')
      ->first();

    if (!$mb || !$ram) test()->markTestSkipped('Cannot find oversized RAM kit for MB in DB');

    $res = validate(['motherboard' => $mb->product_code, 'ram' => $ram->product_code]);
    expect(hasIssue($res, 'ram'))->toBeTrue();
    expect(hasIssue($res, 'motherboard'))->toBeTrue();
  });
});

// ---------------------------------------------------------------------------
// GPU length ↔ Case
// ---------------------------------------------------------------------------

describe('GPU length ↔ Case', function () {
  it('flags gpu and case when GPU is too long for case', function () {
    $case = PcCase::whereNotNull('max_gpu_length')->orderBy('max_gpu_length')->first();
    $gpu  = Gpu::where('length_mm', '>', $case?->max_gpu_length ?? 0)->whereNotNull('length_mm')->first();
    if (!$case || !$gpu) test()->markTestSkipped('Cannot find GPU longer than any case in DB');

    $res = validate(['gpu' => $gpu->product_code, 'case' => $case->product_code]);
    expect(hasIssue($res, 'gpu'))->toBeTrue();
    expect(hasIssue($res, 'case'))->toBeTrue();
  });
});

// ---------------------------------------------------------------------------
// Cooler vs CPU
// ---------------------------------------------------------------------------

describe('Cooler vs CPU', function () {
  it('flags cooler and cpu when cooler socket does not match CPU', function () {
    $cooler = Cooler::where('compatibility', 'LIKE', '%LGA1700%')
      ->whereNotNull('compatibility')
      ->first();
    $cpu    = Cpu::where('socket', 'AM5')->first();
    if (!$cooler || !$cpu) test()->markTestSkipped('Need LGA1700 cooler and AM5 CPU');

    $res = validate(['cooler' => $cooler->product_code, 'cpu' => $cpu->product_code]);
    expect(hasIssue($res, 'cooler'))->toBeTrue();
    expect(hasIssue($res, 'cpu'))->toBeTrue();
  });

  it('flags cooler and cpu when cooler TDP is below CPU TDP', function () {
    $cpu    = Cpu::whereNotNull('tdp')->orderByDesc('tdp')->first();
    $cooler = Cooler::where('tdp_support', '<', $cpu?->tdp ?? PHP_INT_MAX)
      ->whereNotNull('tdp_support')
      ->first();
    if (!$cpu || !$cooler) test()->markTestSkipped('Cannot find cooler with TDP below highest CPU TDP');

    $res = validate(['cpu' => $cpu->product_code, 'cooler' => $cooler->product_code]);
    expect(hasIssue($res, 'cooler'))->toBeTrue();
    expect(hasIssue($res, 'cpu'))->toBeTrue();
  });
});

// ---------------------------------------------------------------------------
// Motherboard form factor vs Case
// ---------------------------------------------------------------------------

describe('Motherboard form factor vs Case', function () {
  it('flags motherboard and case when form factors are incompatible', function () {
    $mb   = Motherboard::where('form_factor', 'ATX')->first();
    $case = PcCase::where('form_factor', 'Mini-ITX')->first();
    if (!$mb || !$case) test()->markTestSkipped('Need ATX MB and Mini-ITX case');

    $res = validate(['motherboard' => $mb->product_code, 'case' => $case->product_code]);
    expect(hasIssue($res, 'motherboard'))->toBeTrue();
    expect(hasIssue($res, 'case'))->toBeTrue();
  });
});

// ---------------------------------------------------------------------------
// Motherboard/Case form factor with no supporting stock
// ---------------------------------------------------------------------------

describe('Motherboard form factor with no case support', function () {
  it('flags motherboard when no case in stock fits its form factor', function () {
    $caseFFs = PcCase::whereNotNull('form_factor')->distinct()->pluck('form_factor');
    $mb = Motherboard::whereNotNull('form_factor')
      ->get()
      ->first(function ($mb) use ($caseFFs) {
        $compatible = CompatibilityHelper::compatibleCasesFor($mb->form_factor);
        return !empty($compatible) && $caseFFs->intersect($compatible)->isEmpty();
      });
    if (!$mb) test()->markTestSkipped('No motherboard form factor without a fitting case in DB');

    $res = validate(['motherboard' => $mb->product_code]);
    expect(hasIssue($res, 'motherboard'))->toBeTrue();
  });

  it('does not flag motherboard when a fitting case exists in stock, even if none is selected', function () {
    $mb = Motherboard::where('form_factor', 'ATX')->first();
    $case = PcCase::whereIn('form_factor', CompatibilityHelper::compatibleCasesFor('ATX'))->first();
    if (!$mb || !$case) test()->markTestSkipped('Need ATX motherboard and a fitting case in DB');

    $res = validate(['motherboard' => $mb->product_code]);
    expect(hasIssue($res, 'motherboard'))->toBeFalse();
  });
});

describe('Unrecognized case form factor', function () {
  // "Raspberry Pi" is a real scraped case form factor value — not in KNOWN_CASE_FORM_FACTORS,
  // and with no size hint in the label, so it must fall back to the smallest known size (mITX)
  it('flags a full-size motherboard paired with an exotic-labeled compact case', function () {
    $case = PcCase::where('form_factor', 'Raspberry Pi')->first();
    $mb = Motherboard::where('form_factor', 'ATX')->first();
    if (!$case || !$mb) test()->markTestSkipped('Need a "Raspberry Pi" form factor case and an ATX motherboard');

    $res = validate(['case' => $case->product_code, 'motherboard' => $mb->product_code]);
    expect(hasIssue($res, 'motherboard'))->toBeTrue();
    expect(hasIssue($res, 'case'))->toBeTrue();
  });

  it('does not flag a mini-ITX motherboard paired with an exotic-labeled compact case', function () {
    $case = PcCase::where('form_factor', 'Raspberry Pi')->first();
    $mb = Motherboard::whereIn('form_factor', ['mITX', 'Mini-ITX', 'ITX'])->first();
    if (!$case || !$mb) test()->markTestSkipped('Need a "Raspberry Pi" form factor case and a mini-ITX motherboard');

    $res = validate(['case' => $case->product_code, 'motherboard' => $mb->product_code]);
    expect(hasIssue($res, 'motherboard'))->toBeFalse();
    expect(hasIssue($res, 'case'))->toBeFalse();
  });

  it('auto-picks a motherboard that actually fits an exotic-labeled compact case', function () {
    $case = PcCase::where('form_factor', 'Raspberry Pi')->first();
    if (!$case) test()->markTestSkipped('Need a "Raspberry Pi" form factor case');

    $picker = app(\App\Services\BuilderSlotPicker::class);
    $mb = $picker->pick('motherboard', ['case' => $case], []);
    if (!$mb) test()->markTestSkipped('No motherboard available in stock to pick');

    expect(in_array($mb->form_factor, ['mITX', 'Mini-ITX', 'ITX'], true))->toBeTrue();
  });
});

describe('Case form factor with no motherboard support', function () {
  it('flags case when no motherboard in stock fits it', function () {
    $mbFFs = Motherboard::whereNotNull('form_factor')->distinct()->pluck('form_factor');
    $case = PcCase::whereNotNull('form_factor')
      ->get()
      ->first(function ($case) use ($mbFFs) {
        $compatible = CompatibilityHelper::compatibleMotherboardsFor($case->form_factor);
        return !empty($compatible) && $mbFFs->intersect($compatible)->isEmpty();
      });
    if (!$case) test()->markTestSkipped('No case form factor without a fitting motherboard in DB');

    $res = validate(['case' => $case->product_code]);
    expect(hasIssue($res, 'case'))->toBeTrue();
  });

  it('does not flag case when a fitting motherboard exists in stock, even if none is selected', function () {
    $case = PcCase::where('form_factor', 'ATX')->first();
    $mb = Motherboard::whereIn('form_factor', CompatibilityHelper::compatibleMotherboardsFor('ATX'))->first();
    if (!$case || !$mb) test()->markTestSkipped('Need ATX case and a fitting motherboard in DB');

    $res = validate(['case' => $case->product_code]);
    expect(hasIssue($res, 'case'))->toBeFalse();
  });
});

// ---------------------------------------------------------------------------
// PSU type vs Case form factor
// ---------------------------------------------------------------------------

describe('PSU type vs Case form factor', function () {
  it('flags psu and case when non-ATX PSU is used with ATX case', function () {
    $psu  = Psu::where('psu_type', 'SFX')->first();
    $case = PcCase::whereIn('form_factor', ['ATX', 'mATX', 'E-ATX'])->first();
    if (!$psu || !$case) test()->markTestSkipped('Need SFX PSU and ATX-class case');

    $res = validate(['psu' => $psu->product_code, 'case' => $case->product_code]);
    expect(hasIssue($res, 'psu'))->toBeTrue();
    expect(hasIssue($res, 'case'))->toBeTrue();
  });
});

// ---------------------------------------------------------------------------
// PSU + case built-in PSU conflict
// ---------------------------------------------------------------------------

describe('PSU conflict with case built-in PSU', function () {
  it('flags psu and case when both a separate PSU and a case with built-in PSU are selected', function () {
    $case = PcCase::where('psu_included', true)->first();
    $psu  = Psu::first();
    if (!$case || !$psu) test()->markTestSkipped('Need case with psu_included and a PSU');

    $res = validate(['case' => $case->product_code, 'psu' => $psu->product_code]);
    expect(hasIssue($res, 'psu'))->toBeTrue();
    expect(hasIssue($res, 'case'))->toBeTrue();
  });
});

// ---------------------------------------------------------------------------
// PSU wattage
// ---------------------------------------------------------------------------

describe('PSU wattage', function () {
  it('flags psu and gpu when PSU wattage is below GPU min_psu', function () {
    $gpu = Gpu::whereNotNull('min_psu')->orderByDesc('min_psu')->first();
    $psu = Psu::where('wattage', '<', $gpu?->min_psu ?? PHP_INT_MAX)->whereNotNull('wattage')->first();
    if (!$gpu || !$psu) test()->markTestSkipped('Cannot find PSU below GPU min_psu');

    $res = validate(['gpu' => $gpu->product_code, 'psu' => $psu->product_code]);
    expect(hasIssue($res, 'psu') || hasIssue($res, 'gpu'))->toBeTrue();
  });

  it('flags case and gpu when case built-in PSU wattage is below GPU min_psu', function () {
    $case = PcCase::where('psu_included', true)->whereNotNull('psu_wattage')->first();
    $gpu  = Gpu::where('min_psu', '>', $case?->psu_wattage ?? PHP_INT_MAX)->whereNotNull('min_psu')->first();
    if (!$case || !$gpu) test()->markTestSkipped('Cannot find GPU that exceeds case built-in PSU wattage');

    $res = validate(['case' => $case->product_code, 'gpu' => $gpu->product_code]);
    expect(hasIssue($res, 'case') || hasIssue($res, 'gpu'))->toBeTrue();
  });
});

// ---------------------------------------------------------------------------
// GPU PCIe connectors vs PSU
// ---------------------------------------------------------------------------

describe('GPU PCIe connectors vs PSU', function () {
  it('flags gpu and psu when GPU needs 16-pin but PSU lacks it', function () {
    $gpu = Gpu::whereRaw("power_connectors REGEXP '16.?pin|12vhpwr'")->first();
    $psu = Psu::where('pcie_5', false)->orWhereNull('pcie_5')->first();
    if (!$gpu || !$psu) test()->markTestSkipped('Need 16-pin GPU and PSU without pcie_5');

    $res = validate(['gpu' => $gpu->product_code, 'psu' => $psu->product_code]);
    expect(hasIssue($res, 'gpu') || hasIssue($res, 'psu'))->toBeTrue();
  });
});

// ---------------------------------------------------------------------------
// M.2 SSD vs Motherboard m2_slots
// ---------------------------------------------------------------------------

describe('M.2 SSD vs Motherboard m2_slots', function () {
  it('flags ssd and motherboard when MB has no M.2 slots', function () {
    $mb  = Motherboard::where('m2_slots', 0)->first();
    $ssd = Ssd::where('form_factor', 'M.2')->first();
    if (!$mb || !$ssd) test()->markTestSkipped('Need MB with 0 M.2 slots and an M.2 SSD');

    $res = validate(['motherboard' => $mb->product_code, 'ssd' => $ssd->product_code]);
    expect(hasIssue($res, 'ssd'))->toBeTrue();
    expect(hasIssue($res, 'motherboard'))->toBeTrue();
  });
});

// ---------------------------------------------------------------------------
// SATA ports
// ---------------------------------------------------------------------------

describe('SATA port issues', function () {
  it('flags hdd and motherboard when MB has 0 SATA ports and HDD is SATA', function () {
    $mb  = Motherboard::where('sata_ports', 0)->first();
    $hdd = Hdd::whereRaw("LOWER(interface) LIKE '%sata%'")->first();
    if (!$mb || !$hdd) test()->markTestSkipped('Need MB with 0 SATA ports and a SATA HDD');

    $res = validate(['motherboard' => $mb->product_code, 'hdd' => $hdd->product_code]);
    expect(hasIssue($res, 'hdd'))->toBeTrue();
    expect(hasIssue($res, 'motherboard'))->toBeTrue();
  });

  it('flags ssd and motherboard when MB has 0 SATA ports and SSD is SATA', function () {
    $mb      = Motherboard::where('sata_ports', 0)->first();
    $sataSsd = Ssd::whereRaw("LOWER(interface) LIKE '%sata%'")->first();
    if (!$mb || !$sataSsd) test()->markTestSkipped('Need MB with 0 SATA ports and a SATA SSD');

    $res = validate(['motherboard' => $mb->product_code, 'ssd' => $sataSsd->product_code]);
    expect(hasIssue($res, 'ssd'))->toBeTrue();
    expect(hasIssue($res, 'motherboard'))->toBeTrue();
  });

  it('flags motherboard when SATA device count exceeds SATA port count', function () {
    $mb      = Motherboard::where('sata_ports', 1)->first();
    $hdd     = Hdd::whereRaw("LOWER(interface) LIKE '%sata%'")->first();
    $sataSsd = Ssd::whereRaw("LOWER(interface) LIKE '%sata%'")->first();
    if (!$mb || !$hdd || !$sataSsd) test()->markTestSkipped('Need MB with 1 SATA port, SATA HDD and SATA SSD');

    $res = validate([
      'motherboard' => $mb->product_code,
      'hdd'         => $hdd->product_code,
      'ssd'         => $sataSsd->product_code,
    ]);
    expect(hasIssue($res, 'motherboard'))->toBeTrue();
  });
});

// ---------------------------------------------------------------------------
// HDD vs Case 3.5" bays
// ---------------------------------------------------------------------------

describe('HDD vs Case 3.5" bays', function () {
  it('flags hdd and case when case has no 3.5" bays', function () {
    $case = PcCase::where('bays_35', 0)->whereNotNull('bays_35')->first();
    $hdd  = Hdd::first();
    if (!$case || !$hdd) test()->markTestSkipped('Need case with bays_35=0 and any HDD');

    $res = validate(['case' => $case->product_code, 'hdd' => $hdd->product_code]);
    expect(hasIssue($res, 'hdd'))->toBeTrue();
    expect(hasIssue($res, 'case'))->toBeTrue();
  });
});

// ---------------------------------------------------------------------------
// Clean builds — no issues
// ---------------------------------------------------------------------------

describe('Clean builds produce no issues', function () {
  it('has no issues for a compatible CPU + MB + RAM combination', function () {
    $mb  = Motherboard::where('socket', 'LGA1700')->where('memory_type', 'DDR4')->first();
    $cpu = Cpu::where('socket', 'LGA1700')->first();
    $ram = Ram::where('memory_type', 'DDR4')->first();
    if (!$mb || !$cpu || !$ram) test()->markTestSkipped('Need compatible LGA1700 DDR4 combo');

    $res = validate([
      'cpu'         => $cpu->product_code,
      'motherboard' => $mb->product_code,
      'ram'         => $ram->product_code,
    ]);
    expect($res->json('issues'))->toBeEmpty();
  });

  it('has no issues for a compatible PSU + ATX case', function () {
    $psu  = Psu::where('psu_type', 'ATX')->first();
    $case = PcCase::where('form_factor', 'ATX')->where('psu_included', false)->first();
    if (!$psu || !$case) test()->markTestSkipped('Need ATX PSU and ATX case');

    $res = validate(['psu' => $psu->product_code, 'case' => $case->product_code]);
    expect(hasIssue($res, 'psu'))->toBeFalse();
    expect(hasIssue($res, 'case'))->toBeFalse();
  });
});
