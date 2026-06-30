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

    // check cooler comaptibilit
    if (($cooler = $selected['cooler'] ?? null)?->compatibility) {
      $sockets = explode(',', $cooler->compatibility);
      $query->where(function (Builder $q) use ($sockets) {
        $q->whereNull('socket')
          ->orWhereIn('socket', $sockets);
      });
    }

    if (($ram = $selected['ram'] ?? null)?->memory_type) {
      $ramType = $ram->memory_type;
      $query->where(function (Builder $q) use ($ramType) {
        $q->whereNull('memory_type')
          ->orWhere('memory_type', $ramType)
          ->orWhere('memory_type', 'DDR4/DDR5');
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

    // motherboard must have enough slots for the RAM kit
    if (($ram = $selected['ram'] ?? null)?->modules_count !== null) {
      $query->where(function (Builder $q) use ($ram) {
        $q->whereNull('memory_slots')
          ->orWhere('memory_slots', '>=', $ram->modules_count);
      });
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

    if (($cpu = $selected['cpu'] ?? null)?->memory_type) {
      $cpuMemType = $cpu->memory_type;
      if ($cpuMemType !== 'DDR4/DDR5') {
        $query->where('memory_type', $cpuMemType);
      }
    }

    // kit must fit in available slots
    if (($mb = $selected['motherboard'] ?? null)?->memory_slots !== null) {
      $query->where(function (Builder $q) use ($mb) {
        $q->whereNull('modules_count')
          ->orWhere('modules_count', '<=', $mb->memory_slots);
      });
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

    // if PSU lacks 16-pin connector, filter out GPUs that require it
    if (($psu = $selected['psu'] ?? null) && !$psu->pcie_5) {
      $query->where(function (Builder $q) {
        $q->whereNull('power_connectors')
          ->orWhereRaw("power_connectors NOT REGEXP '16.?pin|12vhpwr'");
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
    $cpu = $selected['cpu'] ?? null;
    $gpu = $selected['gpu'] ?? null;
    $ram = $selected['ram'] ?? null;
    $fan = $selected['fan'] ?? null;
    $case = $selected['case'] ?? null;

    $cpuTdp = $cpu?->tdp;
    $gpuTdp = $gpu?->tdp;
    $gpuMinPsu = $gpu?->min_psu;

    // case form factor: ATX cases only accept ATX PSUs
    if ($case?->form_factor && CompatibilityHelper::isAtxCaseFormFactor($case->form_factor)) {
      $query->where(function (Builder $q) {
        $q->whereNull('psu_type')->orWhere('psu_type', 'ATX');
      });
    }

    // GPU 16-pin connector: only show PSUs with pcie_5 if GPU requires it
    if ($gpu?->power_connectors) {
      $gpuConn = CompatibilityHelper::parseGpuConnectors($gpu->power_connectors);
      if ($gpuConn['requires_16pin']) {
        $query->where(function (Builder $q) {
          $q->whereNull('pcie_5')->orWhere('pcie_5', 1);
        });
      }
    }

    // need at least gpu min_psu or both tdps to filter wattage
    if ($cpuTdp === null && $gpuMinPsu === null) {
      return $query;
    }

    $ramWattage = ($ram?->modules_count ?? 0) * 5;
    $fanWattage = ($fan?->units_in_package ?? 0) * 3;

    $tdpRequired = ($cpuTdp !== null && $gpuTdp !== null)
      ? ($cpuTdp + $gpuTdp + $ramWattage + $fanWattage) * 1.3
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

  public static function ssd(Builder $query, array $selected): Builder
  {
    if (($mb = $selected['motherboard'] ?? null) && $mb->m2_slots === 0) {
      $query->where(function (Builder $q) {
        $q->whereNull('form_factor')
          ->orWhere('form_factor', '!=', 'M.2');
      });
    }

    return $query;
  }

  public static function hdd(Builder $query, array $selected): Builder
  {
    // if MB has no SATA ports, SATA HDDs can't connect
    if (($mb = $selected['motherboard'] ?? null) && $mb->sata_ports === 0) {
      $query->whereRaw("LOWER(interface) NOT LIKE '%sata%'");
    }

    return $query;
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
