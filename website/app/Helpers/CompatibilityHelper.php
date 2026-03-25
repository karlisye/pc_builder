<?php

namespace App\Helpers;

class CompatibilityHelper
{
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

  public static function compatibleMotherboardsFor(string $caseFormFactor): array
  {
    return self::CASE_FITS_MOTHERBOARD[$caseFormFactor] ?? [];
  }

  public static function isKnownMotherboardFormFactor(?string $ff): bool
  {
    return $ff && in_array($ff, self::KNOWN_MOTHERBOARD_FORM_FACTORS, true);
  }

  public static function isKnownCaseFormFactor(?string $ff): bool
  {
    return $ff && in_array($ff, self::KNOWN_CASE_FORM_FACTORS, true);
  }

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
