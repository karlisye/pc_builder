<?php

namespace App\Services;

use App\Helpers\CompatibilityHelper;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class ComponentFilters
{
  // Whether $item is missing a spec field that a compatibility check relies on, independent of
  // what else is currently selected — e.g. a case with no max_gpu_length can never have its GPU
  // fit verified, no matter which GPU is being compared. This is intentionally intrinsic to the
  // item itself (not the current selection pair), so it doesn't taint every candidate on the
  // *other* side of a comparison — see CompatibilityService::getCompatible().
  public static function hasUnverifiableSpecs(string $type, Model $item): bool
  {
    return match ($type) {
      'cpu' => $item->tdp === null,
      'motherboard' => $item->memory_slots === null
        || $item->max_memory_capacity === null
        || $item->memory_max_speed === null,
      'ram' => $item->modules_count === null
        || $item->capacity === null
        || $item->frequency === null,
      'gpu' => $item->length_mm === null
        || $item->tdp === null
        || $item->min_psu === null,
      'case' => $item->max_gpu_length === null
        || $item->max_cpu_cooler_height === null
        || ($item->psu_included && $item->psu_wattage === null),
      'cooler' => $item->tdp_support === null || $item->height_mm === null,
      'psu' => $item->wattage === null || $item->psu_type === null || $item->pcie_5 === null,
      default => false,
    };
  }

  public static function cpu(Builder $query, array $selected, bool $strict = false): Builder
  {
    if (($mb = $selected['motherboard'] ?? null)?->socket) {
      $query->where('socket', $mb->socket);
    }

    // check cooler comaptibilit
    if (($cooler = $selected['cooler'] ?? null)?->compatibility) {
      $sockets = explode(',', $cooler->compatibility);
      self::whereInOrNull($query, 'socket', $sockets, $strict);
    }

    if (($ram = $selected['ram'] ?? null)?->memory_type) {
      $ramType = $ram->memory_type;
      if ($strict) {
        $query->whereIn('memory_type', [$ramType, 'DDR4/DDR5']);
      } else {
        $query->where(function (Builder $q) use ($ramType) {
          $q->whereNull('memory_type')
            ->orWhere('memory_type', $ramType)
            ->orWhere('memory_type', 'DDR4/DDR5');
        });
      }
    }

    // combined cpu+gpu draw must fit within the selected/case-included PSU
    // (mirrors the formula in psu(), case(), and validateBuild())
    $gpu = $selected['gpu'] ?? null;
    $effectiveWattage = ($selected['psu'] ?? null)?->wattage
      ?? (($selected['case'] ?? null)?->psu_included ? ($selected['case']->psu_wattage ?? null) : null);

    if ($effectiveWattage !== null && $gpu !== null) {
      if ($gpu->tdp !== null) {
        $ram = $selected['ram'] ?? null;
        $fan = $selected['fan'] ?? null;
        $ramWattage = ($ram?->modules_count ?? 0) * 5;
        $fanWattage = ($fan?->units_in_package ?? 0) * 3;

        $maxCpuTdp = ($effectiveWattage / 1.3) - $gpu->tdp - $ramWattage - $fanWattage;

        self::limitBy($query, 'tdp', $maxCpuTdp, '<=', $strict);
      } elseif ($strict) {
        // GPU is selected but its TDP is unknown — can't verify the combined draw fits
        $query->whereRaw('1 = 0');
      }
    }

    return $query;
  }

  public static function motherboard(Builder $query, array $selected, bool $strict = false): Builder
  {
    if (($cpu = $selected['cpu'] ?? null)?->socket) {
      $query->where('socket', $cpu->socket);
    }

    if (($ram = $selected['ram'] ?? null)?->memory_type) {
      $query->where('memory_type', $ram->memory_type);
    }

    // motherboard must have enough slots for the RAM kit
    if ($ram = $selected['ram'] ?? null) {
      self::limitBy($query, 'memory_slots', $ram->modules_count, '>=', $strict);
    }

    // motherboard max memory must accommodate the RAM kit capacity
    if ($ram = $selected['ram'] ?? null) {
      self::limitBy($query, 'max_memory_capacity', $ram->capacity, '>=', $strict);
    }

    // motherboard max speed must support the RAM frequency
    if ($ram = $selected['ram'] ?? null) {
      self::limitBy($query, 'memory_max_speed', $ram->frequency, '>=', $strict);
    }

    if ($case = $selected['case'] ?? null) {
      self::applyFormFactorFilter($query, $case->form_factor, side: 'motherboard');
    }

    return $query;
  }

  public static function ram(Builder $query, array $selected, bool $strict = false): Builder
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
    if ($mb = $selected['motherboard'] ?? null) {
      self::limitBy($query, 'modules_count', $mb->memory_slots, '<=', $strict);
    }

    // kit capacity must not exceed motherboard max memory
    if ($mb = $selected['motherboard'] ?? null) {
      self::limitBy($query, 'capacity', $mb->max_memory_capacity, '<=', $strict);
    }

    // ram frequency must not exceed motherboard max speed
    if ($mb = $selected['motherboard'] ?? null) {
      self::limitBy($query, 'frequency', $mb->memory_max_speed, '<=', $strict);
    }

    return $query;
  }

  public static function gpu(Builder $query, array $selected, bool $strict = false): Builder
  {
    if ($case = $selected['case'] ?? null) {
      self::limitBy($query, 'length_mm', $case->max_gpu_length, '<=', $strict);
    }

    $effectiveWattage = ($selected['psu'] ?? null)?->wattage
      ?? (($selected['case'] ?? null)?->psu_included ? ($selected['case']->psu_wattage ?? null) : null);

    if ($effectiveWattage !== null) {
      self::limitBy($query, 'min_psu', $effectiveWattage, '<=', $strict);

      // combined cpu+gpu draw must also fit within the selected/case-included
      // PSU, not just the GPU's own min_psu recommendation (mirrors the
      // formula in cpu(), psu(), case(), and validateBuild())
      $cpu = $selected['cpu'] ?? null;
      if ($cpu !== null) {
        if ($cpu->tdp !== null) {
          $ram = $selected['ram'] ?? null;
          $fan = $selected['fan'] ?? null;
          $ramWattage = ($ram?->modules_count ?? 0) * 5;
          $fanWattage = ($fan?->units_in_package ?? 0) * 3;

          $maxGpuTdp = ($effectiveWattage / 1.3) - $cpu->tdp - $ramWattage - $fanWattage;

          self::limitBy($query, 'tdp', $maxGpuTdp, '<=', $strict);
        } elseif ($strict) {
          // CPU is selected but its TDP is unknown — can't verify the combined draw fits
          $query->whereRaw('1 = 0');
        }
      }
    }

    // if PSU lacks 16-pin connector, filter out GPUs that require it
    if (($psu = $selected['psu'] ?? null) && !$psu->pcie_5) {
      $query->where(function (Builder $q) {
        $q->whereNull('power_connectors')
          ->orWhereRaw("power_connectors NOT REGEXP '16.?pin|12vhpwr'");
      });
    }

    // PSU traditional PCIe connector count (6/8/6+2-pin): GPU candidates that need more
    // than the selected PSU provides are incompatible. Separate from the 16-pin check
    // above (that only covers ATX 3.0-style connectors) and can't be expressed as a plain
    // column comparison since both fields are free-text, so candidates are materialized
    // and filtered in PHP via the same parse helpers validateBuild() uses — mirrors the
    // pluck-ids-then-constrain idiom CompatibilityService::getCompatible() already uses.
    if ($psu = $selected['psu'] ?? null) {
      $psuTraditional = $psu->pcie_connectors !== null
        ? CompatibilityHelper::parsePsuPcieConnectors($psu->pcie_connectors)
        : null;

      $excludedIds = (clone $query)->get(['id', 'power_connectors'])
        ->filter(function ($candidate) use ($psuTraditional, $strict) {
          $required = CompatibilityHelper::parseGpuConnectors($candidate->power_connectors)['required_traditional'];
          if ($required === 0) {
            return false;
          }
          return $psuTraditional === null ? $strict : $required > $psuTraditional;
        })
        ->pluck('id');

      if ($excludedIds->isNotEmpty()) {
        $query->whereNotIn('id', $excludedIds);
      }
    }

    return $query;
  }

  public static function case(Builder $query, array $selected, bool $strict = false): Builder
  {
    if ($gpu = $selected['gpu'] ?? null) {
      self::limitBy($query, 'max_gpu_length', $gpu->length_mm, '>=', $strict);
    }

    if ($cooler = $selected['cooler'] ?? null) {
      self::limitBy($query, 'max_cpu_cooler_height', $cooler->height_mm, '>=', $strict);
    }

    if ($mb = $selected['motherboard'] ?? null) {
      self::applyFormFactorFilter($query, $mb->form_factor, side: 'case');
    }

    // if a separate PSU is selected, cases with a built-in PSU are incompatible
    if ($psuSelected = $selected['psu'] ?? null) {
      $query->where(function (Builder $q) {
        $q->whereNull('psu_included')->orWhere('psu_included', 0);
      });

      // non-ATX PSUs (SFX, SFX-L, TFX, ...) don't fit in ATX-class cases
      if ($psuSelected->psu_type && $psuSelected->psu_type !== 'ATX') {
        $query->where(function (Builder $q) {
          $q->whereNull('form_factor')
            ->orWhereNotIn('form_factor', CompatibilityHelper::KNOWN_ATX_CASE_FORM_FACTORS);
        });
      }
    }

    // if HDD is selected, case must have at least one 3.5" bay
    if ($selected['hdd'] ?? null) {
      $query->where(function (Builder $q) {
        $q->whereNull('bays_35')
          ->orWhere('bays_35', '>', 0);
      });
    }

    // cases with a built-in PSU must have enough wattage for the selected GPU/CPU
    $gpu = $selected['gpu'] ?? null;
    $cpu = $selected['cpu'] ?? null;
    $ram = $selected['ram'] ?? null;
    $fan = $selected['fan'] ?? null;
    $gpuMinPsu = $gpu?->min_psu;
    $cpuTdp = $cpu?->tdp;
    $gpuTdp = $gpu?->tdp;

    if ($gpu !== null && ($gpuMinPsu !== null || ($cpuTdp !== null && $gpuTdp !== null))) {
      $ramWattage = ($ram?->modules_count ?? 0) * 5;
      $fanWattage = ($fan?->units_in_package ?? 0) * 3;

      $tdpRequired = ($cpuTdp !== null && $gpuTdp !== null)
        ? ($cpuTdp + $gpuTdp + $ramWattage + $fanWattage) * 1.3
        : 0;

      $requiredWattage = max($tdpRequired, $gpuMinPsu ?? 0);

      if ($requiredWattage > 0) {
        $query->where(function (Builder $q) use ($requiredWattage, $strict) {
          // cases without built-in PSU are always fine (separate PSU handles power)
          $q->where(function (Builder $inner) {
            $inner->whereNull('psu_included')->orWhere('psu_included', 0);
          })->orWhere(function (Builder $inner) use ($requiredWattage, $strict) {
            // cases with built-in PSU must have sufficient wattage
            $inner->where('psu_included', 1)
              ->where(function (Builder $i2) use ($requiredWattage, $strict) {
                if ($strict) {
                  $i2->where('psu_wattage', '>=', $requiredWattage);
                } else {
                  // null = unknown, allow through
                  $i2->whereNull('psu_wattage')
                    ->orWhere('psu_wattage', '>=', $requiredWattage);
                }
              });
          });
        });
      }
    }

    return $query;
  }

  public static function cooler(Builder $query, array $selected, bool $strict = false): Builder
  {
    if (($cpu = $selected['cpu'] ?? null)?->socket) {
      $socket = $cpu->socket;
      if ($strict) {
        $query->whereRaw('FIND_IN_SET(?, compatibility)', [$socket]);
      } else {
        $query->where(function (Builder $q) use ($socket) {
          $q->whereNull('compatibility')
            ->orWhereRaw('FIND_IN_SET(?, compatibility)', [$socket]);
        });
      }
    }

    if ($cpu = $selected['cpu'] ?? null) {
      self::limitBy($query, 'tdp_support', $cpu->tdp, '>=', $strict);
    }

    if ($case = $selected['case'] ?? null) {
      self::limitBy($query, 'height_mm', $case->max_cpu_cooler_height, '<=', $strict);
    }

    return $query;
  }

  public static function psu(Builder $query, array $selected, bool $strict = false): Builder
  {
    $cpu = $selected['cpu'] ?? null;
    $gpu = $selected['gpu'] ?? null;
    $ram = $selected['ram'] ?? null;
    $fan = $selected['fan'] ?? null;
    $case = $selected['case'] ?? null;

    // if selected case includes a built-in PSU, no separate PSU is compatible
    if ($case?->psu_included) {
      return $query->whereRaw('1 = 0');
    }

    $cpuTdp = $cpu?->tdp;
    $gpuTdp = $gpu?->tdp;
    $gpuMinPsu = $gpu?->min_psu;

    // case form factor: ATX cases only accept ATX PSUs
    if ($case?->form_factor && CompatibilityHelper::isAtxCaseFormFactor($case->form_factor)) {
      if ($strict) {
        $query->where('psu_type', 'ATX');
      } else {
        $query->where(function (Builder $q) {
          $q->whereNull('psu_type')->orWhere('psu_type', 'ATX');
        });
      }
    }

    // GPU 16-pin connector: only show PSUs with pcie_5 if GPU requires it
    if ($gpu?->power_connectors) {
      $gpuConn = CompatibilityHelper::parseGpuConnectors($gpu->power_connectors);
      if ($gpuConn['requires_16pin']) {
        if ($strict) {
          $query->where('pcie_5', 1);
        } else {
          $query->where(function (Builder $q) {
            $q->whereNull('pcie_5')->orWhere('pcie_5', 1);
          });
        }
      }

      // GPU traditional PCIe connector count (6/8/6+2-pin): PSU candidates must provide
      // at least as many as the GPU needs. See the mirrored block in
      // ComponentFilters::gpu() for why this is done via materialize-then-exclude
      // instead of a plain column comparison.
      if ($gpuConn['required_traditional'] > 0) {
        $excludedIds = (clone $query)->get(['id', 'pcie_connectors'])
          ->filter(function ($candidate) use ($gpuConn, $strict) {
            if ($candidate->pcie_connectors === null) {
              return $strict;
            }
            return CompatibilityHelper::parsePsuPcieConnectors($candidate->pcie_connectors) < $gpuConn['required_traditional'];
          })
          ->pluck('id');

        if ($excludedIds->isNotEmpty()) {
          $query->whereNotIn('id', $excludedIds);
        }
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

    self::limitBy($query, 'wattage', $requiredWattage, '>=', $strict);

    return $query;
  }

  public static function ssd(Builder $query, array $selected): Builder
  {
    if (($mb = $selected['motherboard'] ?? null) && $mb->m2_slots === 0) {
      $query->where(function (Builder $q) {
        $q->whereNull('form_factor')
          ->orWhere('form_factor', '!=', 'M.2');
      });
    }

    if ($mb = $selected['motherboard'] ?? null) {
      $hdd = $selected['hdd'] ?? null;
      $usedSata = ($hdd && str_contains(strtolower($hdd->interface ?? ''), 'sata')) ? 1 : 0;
      $remainingSata = ($mb->sata_ports ?? PHP_INT_MAX) - $usedSata;

      if ($remainingSata <= 0) {
        $query->where(function (Builder $q) {
          $q->whereNull('interface')
            ->orWhereRaw("LOWER(interface) NOT LIKE '%sata%'");
        });
      }
    }

    return $query;
  }

  public static function hdd(Builder $query, array $selected): Builder
  {
    if ($mb = $selected['motherboard'] ?? null) {
      $ssd = $selected['ssd'] ?? null;
      $usedSata = ($ssd && str_contains(strtolower($ssd->interface ?? ''), 'sata')) ? 1 : 0;
      $remainingSata = ($mb->sata_ports ?? PHP_INT_MAX) - $usedSata;

      if ($remainingSata <= 0) {
        $query->whereRaw('1 = 0');
      }
    }

    // if case has no 3.5" bays, standard HDDs can't be mounted
    if (($case = $selected['case'] ?? null) && $case->bays_35 === 0) {
      $query->whereRaw('1 = 0');
    }

    return $query;
  }

  private static function applyFormFactorFilter(Builder $query, ?string $formFactor, string $side): void
  {
    if (! $formFactor) {
      return;
    }

    if ($side === 'case') {
      // if mb form factor unknown, skip restricting (motherboard form factors in stock are
      // consistently standard, unlike case form factors — see the 'motherboard' branch below)
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
      // unrecognized case form factor (e.g. "Raspberry Pi", "UCFF 4\" x 4\"") — try to pull a known
      // size out of the label, otherwise fall back to the smallest known size. Never leave the
      // motherboard query unrestricted here, or a full-size board could get matched to a tiny case
      if (! CompatibilityHelper::isKnownCaseFormFactor($formFactor)) {
        $formFactor = CompatibilityHelper::inferKnownCaseFormFactor($formFactor) ?? 'mITX';
      }

      $compatibleMotherboards = CompatibilityHelper::compatibleMotherboardsFor($formFactor);

      $query->where(function (Builder $q) use ($compatibleMotherboards) {
        // known mobos must match
        $q->whereNotIn('form_factor', CompatibilityHelper::KNOWN_MOTHERBOARD_FORM_FACTORS)
          ->orWhereIn('form_factor', $compatibleMotherboards);
      });
    }
  }

  // Applies a numeric limit against $column. In loose mode (manual browsing) a null value
  // on either side is treated as "can't rule it out" and let through — the frontend flags
  // these as needing a manual check. In strict mode (auto-builder) null on either side means
  // the fit can't be verified, so the candidate is excluded outright rather than guessed at.
  private static function limitBy(Builder $query, string $column, ?float $limit, string $operator, bool $strict): void
  {
    if ($limit === null) {
      if ($strict) {
        $query->whereRaw('1 = 0');
      }
      return;
    }

    if ($strict) {
      $query->where($column, $operator, $limit);
    } else {
      $query->where(function (Builder $q) use ($column, $operator, $limit) {
        $q->whereNull($column)->orWhere($column, $operator, $limit);
      });
    }
  }

  // Same idea as limitBy(), but for an IN-list match instead of a numeric comparison.
  private static function whereInOrNull(Builder $query, string $column, array $values, bool $strict): void
  {
    if ($strict) {
      $query->whereIn($column, $values);
    } else {
      $query->where(function (Builder $q) use ($column, $values) {
        $q->whereNull($column)->orWhereIn($column, $values);
      });
    }
  }
}
