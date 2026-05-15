<?php

namespace App\Services;

use App\Helpers\CompatibilityHelper;
use Illuminate\Database\Eloquent\Builder;

class ComponentFilters
{
  public static function cpu(Builder $query, array $selected): Builder
  {
    if (($mb = $selected['motherboard'] ?? null)?->socket) {
      $query->where('socket', $mb->socket);
    }

    if (($cooler = $selected['cooler'] ?? null)?->compatibility) {
      $sockets = explode(',', $cooler->compatibility);
      $query->where(function (Builder $q) use ($sockets) {
        $q->whereNull('socket')
          ->orWhereIn('socket', $sockets);
      });
    }

    return $query;
  }

  public static function motherboard(Builder $query, array $selected): Builder
  {
    if (($cpu = $selected['cpu'] ?? null)?->socket) {
      $query->where('socket', $cpu->socket);
    }

    if (($ram = $selected['ram'] ?? null)?->memory_type) {
      $query->where('memory_type', $ram->memory_type);
    }

    if ($case = $selected['case'] ?? null) {
      self::applyFormFactorFilter($query, $case->form_factor, side: 'motherboard');
    }

    return $query;
  }

  public static function ram(Builder $query, array $selected): Builder
  {
    if (($mb = $selected['motherboard'] ?? null)?->memory_type) {
      $query->where('memory_type', $mb->memory_type);
    }

    return $query;
  }

  public static function gpu(Builder $query, array $selected): Builder
  {
    if (($case = $selected['case'] ?? null)?->max_gpu_length !== null) {
      $query->where(function (Builder $q) use ($case) {
        $q->whereNull('length_mm')
          ->orWhere('length_mm', '<=', $case->max_gpu_length);
      });
    }

    if (($psu = $selected['psu'] ?? null)?->wattage !== null) {
      $query->where(function (Builder $q) use ($psu) {
        $q->whereNull('min_psu')
          ->orWhere('min_psu', '<=', $psu->wattage);
      });
    }

    return $query;
  }

  public static function case(Builder $query, array $selected): Builder
  {
    if (($gpu = $selected['gpu'] ?? null)?->length_mm !== null) {
      $query->where(function (Builder $q) use ($gpu) {
        $q->whereNull('max_gpu_length')
          ->orWhere('max_gpu_length', '>=', $gpu->length_mm);
      });
    }

    if (($cooler = $selected['cooler'] ?? null)?->height_mm !== null) {
      $query->where(function (Builder $q) use ($cooler) {
        $q->whereNull('max_cpu_cooler_height')
          ->orWhere('max_cpu_cooler_height', '>=', $cooler->height_mm);
      });
    }

    if ($mb = $selected['motherboard'] ?? null) {
      self::applyFormFactorFilter($query, $mb->form_factor, side: 'case');
    }

    return $query;
  }

  public static function cooler(Builder $query, array $selected): Builder
  {
    if (($cpu = $selected['cpu'] ?? null)?->socket) {
      $socket = $cpu->socket;
      $query->where(function (Builder $q) use ($socket) {
        $q->whereNull('compatibility')
          ->orWhereRaw('FIND_IN_SET(?, compatibility)', [$socket]);
      });
    }

    if (($cpu = $selected['cpu'] ?? null)?->tdp !== null) {
      $query->where(function (Builder $q) use ($cpu) {
        $q->whereNull('tdp_support')
          ->orWhere('tdp_support', '>=', $cpu->tdp);
      });
    }

    if (($case = $selected['case'] ?? null)?->max_cpu_cooler_height !== null) {
      $query->where(function (Builder $q) use ($case) {
        $q->whereNull('height_mm')
          ->orWhere('height_mm', '<=', $case->max_cpu_cooler_height);
      });
    }

    return $query;
  }

  public static function psu(Builder $query, array $selected): Builder
  {
    $cpuTdp = ($selected['cpu'] ?? null)?->tdp;
    $gpuTdp = ($selected['gpu'] ?? null)?->tdp;
    $gpuMinPsu = ($selected['gpu'] ?? null)?->min_psu;
    $case = $selected['case'] ?? null;

    // need at least gpu min_psu or both tdps to filter
    if ($cpuTdp === null && $gpuMinPsu === null) {
      return $query;
    }

    $tdpRequired = ($cpuTdp !== null && $gpuTdp !== null)
      ? ($cpuTdp + $gpuTdp) * 1.3
      : 0;

    $requiredWattage = max($tdpRequired, $gpuMinPsu ?? 0);

    if ($requiredWattage <= 0) {
      return $query;
    }

    if ($case?->psu_wattage !== null && $case->psu_wattage >= $requiredWattage) {
      return $query->whereRaw('1 = 0');
    }

    return $query->where(function (Builder $q) use ($requiredWattage) {
      $q->whereNull('wattage')
        ->orWhere('wattage', '>=', $requiredWattage);
    });
  }

  private static function applyFormFactorFilter(Builder $query, ?string $formFactor, string $side): void
  {
    if (! $formFactor) {
      return;
    }

    if ($side === 'case') {
      // if mb form factor unknown, just skip and show warning
      if (! CompatibilityHelper::isKnownMotherboardFormFactor($formFactor)) {
        return;
      }

      $compatibleCases = CompatibilityHelper::compatibleCasesFor($formFactor);

      $query->where(function (Builder $q) use ($compatibleCases) {
        // known cases must match
        $q->whereNotIn('form_factor', CompatibilityHelper::KNOWN_CASE_FORM_FACTORS)
          ->orWhereIn('form_factor', $compatibleCases);
      });
    } elseif ($side === 'motherboard') {
      // if case form factor unknown, just skip and show warning
      if (! CompatibilityHelper::isKnownCaseFormFactor($formFactor)) {
        return;
      }

      $compatibleMotherboards = CompatibilityHelper::compatibleMotherboardsFor($formFactor);

      $query->where(function (Builder $q) use ($compatibleMotherboards) {
        // known mobos must match
        $q->whereNotIn('form_factor', CompatibilityHelper::KNOWN_MOTHERBOARD_FORM_FACTORS)
          ->orWhereIn('form_factor', $compatibleMotherboards);
      });
    }
  }
}
