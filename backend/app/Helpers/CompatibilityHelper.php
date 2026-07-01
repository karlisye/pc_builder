<?php

namespace App\Helpers;

class CompatibilityHelper
{
  // List what case fits motherboard size
  public const CASE_FITS_MOTHERBOARD = [
    'XL ATX' => ['ATX', 'Extended ATX', 'E-ATX', 'EEB', 'SSI-EEB', 'SSI-CEB', 'CEB', 'mATX', 'Micro ATX', 'mDTX', 'mITX', 'Mini-ITX', 'ITX'],
    'Extended ATX' => ['ATX', 'Extended ATX', 'E-ATX', 'EEB', 'SSI-EEB', 'SSI-CEB', 'CEB', 'mATX', 'Micro ATX', 'mDTX', 'mITX', 'Mini-ITX', 'ITX'],
    'E-ATX' => ['ATX', 'Extended ATX', 'E-ATX', 'EEB', 'SSI-EEB', 'SSI-CEB', 'CEB', 'mATX', 'Micro ATX', 'mDTX', 'mITX', 'Mini-ITX', 'ITX'],
    'EEB' => ['ATX', 'Extended ATX', 'E-ATX', 'EEB', 'SSI-EEB', 'SSI-CEB', 'CEB', 'mATX', 'Micro ATX', 'mDTX', 'mITX', 'Mini-ITX', 'ITX'],
    'SSI-EEB' => ['ATX', 'Extended ATX', 'E-ATX', 'EEB', 'SSI-EEB', 'SSI-CEB', 'CEB', 'mATX', 'Micro ATX', 'mDTX', 'mITX', 'Mini-ITX', 'ITX'],
    'SSI-CEB' => ['ATX', 'Extended ATX', 'E-ATX', 'EEB', 'SSI-EEB', 'SSI-CEB', 'CEB', 'mATX', 'Micro ATX', 'mDTX', 'mITX', 'Mini-ITX', 'ITX'],
    'CEB' => ['ATX', 'Extended ATX', 'E-ATX', 'EEB', 'SSI-EEB', 'SSI-CEB', 'CEB', 'mATX', 'Micro ATX', 'mDTX', 'mITX', 'Mini-ITX', 'ITX'],
    'ATX' => ['ATX', 'Extended ATX', 'E-ATX', 'EEB', 'SSI-EEB', 'SSI-CEB', 'CEB', 'mATX', 'Micro ATX', 'mDTX', 'mITX', 'Mini-ITX', 'ITX'],
    'mATX' => ['mATX', 'Micro ATX', 'mDTX', 'mITX', 'Mini-ITX', 'ITX'],
    'Micro ATX' => ['mATX', 'Micro ATX', 'mDTX', 'mITX', 'Mini-ITX', 'ITX'],
    'mITX' => ['mITX', 'Mini-ITX', 'ITX'],
    'Mini-ITX' => ['mITX', 'Mini-ITX', 'ITX'],
    'ITX' => ['mITX', 'Mini-ITX', 'ITX'],
  ];

  // known motherboard sizes
  public const KNOWN_MOTHERBOARD_FORM_FACTORS = [
    'ATX',
    'Extended ATX',
    'E-ATX',
    'EEB',
    'SSI-EEB',
    'SSI-CEB',
    'CEB',
    'mATX',
    'Micro ATX',
    'mDTX',
    'mITX',
    'Mini-ITX',
    'ITX',
  ];

  // ATX-class case form factors — only accept ATX PSUs
  public const KNOWN_ATX_CASE_FORM_FACTORS = [
    'XL ATX', 'Extended ATX', 'E-ATX', 'EEB', 'SSI-EEB', 'SSI-CEB', 'CEB', 'ATX', 'mATX', 'Micro ATX',
  ];

  // known case sizes
  public const KNOWN_CASE_FORM_FACTORS = [
    'XL ATX',
    'Extended ATX',
    'E-ATX',
    'EEB',
    'SSI-EEB',
    'SSI-CEB',
    'CEB',
    'ATX',
    'mATX',
    'Micro ATX',
    'mITX',
    'Mini-ITX',
    'ITX',
  ];

  // return the array of compatible cases
  public static function compatibleCasesFor(string $mbFormFactor): array
  {
    $compatible = [];
    foreach (self::CASE_FITS_MOTHERBOARD as $caseFF => $mbFFs) {
      if (in_array($mbFormFactor, $mbFFs, true)) {
        $compatible[] = $caseFF;
      }
    }
    return $compatible;
  }

  // return the array of compatible mobos
  public static function compatibleMotherboardsFor(string $caseFormFactor): array
  {
    return self::CASE_FITS_MOTHERBOARD[$caseFormFactor] ?? [];
  }

  // validate known motherboards
  public static function isKnownMotherboardFormFactor(?string $ff): bool
  {
    return $ff && in_array($ff, self::KNOWN_MOTHERBOARD_FORM_FACTORS, true);
  }

  // validate known cases
  public static function isKnownCaseFormFactor(?string $ff): bool
  {
    return $ff && in_array($ff, self::KNOWN_CASE_FORM_FACTORS, true);
  }

  public static function isAtxCaseFormFactor(?string $ff): bool
  {
    return $ff !== null && in_array($ff, self::KNOWN_ATX_CASE_FORM_FACTORS, true);
  }

  // Returns ['requires_16pin' => bool, 'required_traditional' => int]
  public static function parseGpuConnectors(?string $connectors): array
  {
    if (!$connectors) {
      return ['requires_16pin' => false, 'required_traditional' => 0];
    }
    $requires16pin = (bool) preg_match('/16-?pin|12vhpwr/i', $connectors);
    $traditional = 0;
    preg_match_all('/(\d+)\s*[xX×]\s*(?:6\+2|6|8)-?pin/i', $connectors, $matches);
    foreach ($matches[1] as $count) {
      $traditional += (int) $count;
    }
    return ['requires_16pin' => $requires16pin, 'required_traditional' => $traditional];
  }

  // Sum of traditional PCIe connector slots a PSU provides (6-pin, 8-pin, 6+2-pin)
  public static function parsePsuPcieConnectors(?string $connectors): int
  {
    if (!$connectors) {
      return 0;
    }
    $total = 0;
    preg_match_all('/(\d+)\s*[xX×]\s*(?:6\+2|6|8)-?pin/i', $connectors, $matches);
    foreach ($matches[1] as $count) {
      $total += (int) $count;
    }
    return $total;
  }

  // Whether a CPU memory_type supports a given RAM memory_type
  public static function cpuSupportsRamType(?string $cpuMemType, string $ramMemType): bool
  {
    if (!$cpuMemType) {
      return true;
    }
    if ($cpuMemType === 'DDR4/DDR5') {
      return true;
    }
    return $cpuMemType === $ramMemType;
  }

  // if case or mobo has an exotic size, return a warning
  public static function exoticFormFactorWarning(array $selected): ?string
  {
    $mb = $selected['motherboard'] ?? null;
    $case = $selected['case'] ?? null;

    if ($mb?->form_factor && ! self::isKnownMotherboardFormFactor($mb->form_factor)) {
      return "selected motherboard has a non-standard form factor ({$mb->form_factor})"
        . ' - case compatibility could not be automatically verified. check manually.';
    }

    if ($case?->form_factor && ! self::isKnownCaseFormFactor($case->form_factor)) {
      return "selected case has a non-standard form factor ({$case->form_factor})"
        . ' - motherboard compatibility could not be automatically verified. check manually.';
    }

    return null;
  }
}
