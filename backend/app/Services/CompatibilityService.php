<?php

namespace App\Services;

use App\Helpers\CompatibilityHelper;
use App\Models\{Cpu, Motherboard, Ram, Gpu, Ssd, Hdd, PcCase, Fan, Psu, Cooler};
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class CompatibilityService
{
  public const VALID_TYPES = [
    'cpu' => Cpu::class,
    'motherboard' => Motherboard::class,
    'ram' => Ram::class,
    'gpu' => Gpu::class,
    'ssd' => Ssd::class,
    'hdd' => Hdd::class,
    'case' => PcCase::class,
    'cooler' => Cooler::class,
    'psu' => Psu::class,
    'fan' => Fan::class,
  ];

  public function resolveSelected(array $selectedIds): array
  {
    $resolved = [];

    foreach ($selectedIds as $type => $productCode) {
      // check if selected types exist in VALID_TYPES
      if (! array_key_exists($type, self::VALID_TYPES)) {
        throw new \InvalidArgumentException(
          "'{$type}' is not a valid component type - valid types are: "
            . implode(', ', array_keys(self::VALID_TYPES))
        );
      }

      // check if component exists with the id
      $modelClass = self::VALID_TYPES[$type];
      $model = $modelClass::where('product_code', $productCode)->first();
      if (!$model) {
        throw new \InvalidArgumentException("No {$type} found with product_code {$productCode}");
      }
      $resolved[$type] = $model;
    }

    return $resolved;
  }

  public function getCompatible(string $type, array $selected, array $filters = []): LengthAwarePaginator
  {
    $modelClass = self::VALID_TYPES[$type];

    // get all components
    $query = $modelClass::query()->with(['listings' => fn($q) => $q->orderBy('price')]);

    // get only available components
    $compatibleQuery = $modelClass::query();

    // add filters for the specific component
    $compatibleQuery = match ($type) {
      'cpu' => ComponentFilters::cpu($compatibleQuery, $selected),
      'motherboard' => ComponentFilters::motherboard($compatibleQuery, $selected),
      'ram' => ComponentFilters::ram($compatibleQuery, $selected),
      'gpu' => ComponentFilters::gpu($compatibleQuery, $selected),
      'case' => ComponentFilters::case($compatibleQuery, $selected),
      'cooler' => ComponentFilters::cooler($compatibleQuery, $selected),
      'psu' => ComponentFilters::psu($compatibleQuery, $selected),
      'ssd' => ComponentFilters::ssd($compatibleQuery, $selected),
      'hdd' => ComponentFilters::hdd($compatibleQuery, $selected),
      default => $compatibleQuery,
    };

    // get all compatible ids from query into an array
    $compatibleIds = $compatibleQuery->pluck('id')->toArray();

    $query = ComponentQueryFilter::apply($query, $type, $filters, $compatibleIds);

    // e.g. if user already has cpu selected, but still wants to see cpus, will return the cpu id
    $selectedIdForType = isset($selected[$type]) ? $selected[$type]->id : null;
    $caseHasPsu = $type === 'psu' && ($selected['case'] ?? null)?->psu_included;

    $paginator = $query->paginate(15);

    // add the selected boolean, compatible and out_of_stock flags to each component
    $paginator->getCollection()->transform(function ($item) use ($type, $selectedIdForType, $compatibleIds, $caseHasPsu) {
      $item->selected = ($item->id === $selectedIdForType);
      $item->compatible = in_array($item->id, $compatibleIds);
      $item->needs_manual_check = ComponentFilters::hasUnverifiableSpecs($type, $item);
      $item->out_of_stock = $item->stock_status === 'out_of_stock';
      if ($caseHasPsu) {
        $item->case_includes_psu = true;
      }
      return $item;
    });

    return $paginator;
  }

  public function validateBuild(array $selected): array
  {
    $issues = [];
    $warnings = [];

    $cpu = $selected['cpu'] ?? null;
    $mb = $selected['motherboard'] ?? null;
    $ram = $selected['ram'] ?? null;
    $gpu = $selected['gpu'] ?? null;
    $case = $selected['case'] ?? null;
    $cooler = $selected['cooler'] ?? null;
    $psu = $selected['psu'] ?? null;
    $ssd = $selected['ssd'] ?? null;
    $hdd = $selected['hdd'] ?? null;
    $fan = $selected['fan'] ?? null;

    // cpu / motherboard socket
    if ($cpu && $mb && $cpu->socket !== $mb->socket) {
      $issues['cpu'][] = __('compatibility.cpu_socket_mismatch', [
        'cpu_socket' => $cpu->socket,
        'mb_socket' => $mb->socket,
      ]);
      $issues['motherboard'][] = __('compatibility.motherboard_socket_mismatch', [
        'mb_socket' => $mb->socket,
        'cpu_socket' => $cpu->socket,
      ]);
    }

    // motherboard / ram memory type
    if ($mb && $ram && $mb->memory_type !== $ram->memory_type) {
      $issues['motherboard'][] = __('compatibility.motherboard_memory_mismatch', [
        'mb_type' => $mb->memory_type,
        'ram_type' => $ram->memory_type,
      ]);
      $issues['ram'][] = __('compatibility.ram_memory_mismatch', [
        'ram_type' => $ram->memory_type,
        'mb_type' => $mb->memory_type,
      ]);
    }

    // cpu / ram memory type
    if ($cpu && $ram && $cpu->memory_type && !CompatibilityHelper::cpuSupportsRamType($cpu->memory_type, $ram->memory_type)) {
      $issues['cpu'][] = __('compatibility.cpu_ram_memory_mismatch', [
        'cpu_type' => $cpu->memory_type,
        'ram_type' => $ram->memory_type,
      ]);
      $issues['ram'][] = __('compatibility.ram_cpu_memory_mismatch', [
        'ram_type' => $ram->memory_type,
        'cpu_type' => $cpu->memory_type,
      ]);
    }

    // ram memory type not supported by any motherboard in stock
    if ($ram && ! $mb && $ram->memory_type && ! Motherboard::where('memory_type', $ram->memory_type)->exists()) {
      $issues['ram'][] = __('compatibility.ram_no_motherboard_support', [
        'ram_type' => $ram->memory_type,
      ]);
    }

    // ram modules vs motherboard memory slots
    if ($ram && $mb && $ram->modules_count !== null && $mb->memory_slots !== null) {
      if ($ram->modules_count > $mb->memory_slots) {
        $issues['ram'][] = __('compatibility.ram_too_many_modules', [
          'modules' => $ram->modules_count,
          'slots' => $mb->memory_slots,
        ]);
        $issues['motherboard'][] = __('compatibility.motherboard_not_enough_slots', [
          'slots' => $mb->memory_slots,
          'modules' => $ram->modules_count,
        ]);
      }
    }

    // ram capacity vs motherboard max memory
    if ($ram && $mb && $ram->capacity !== null && $mb->max_memory_capacity !== null) {
      if ($ram->capacity > $mb->max_memory_capacity) {
        $issues['ram'][] = __('compatibility.ram_exceeds_max_capacity', [
          'ram_capacity' => $ram->capacity,
          'mb_max' => $mb->max_memory_capacity,
        ]);
        $issues['motherboard'][] = __('compatibility.motherboard_max_capacity_exceeded', [
          'mb_max' => $mb->max_memory_capacity,
          'ram_capacity' => $ram->capacity,
        ]);
      }
    }

    // ram speed vs motherboard max
    if ($ram && $mb && $ram->frequency !== null && $mb->memory_max_speed !== null) {
      if ($ram->frequency > $mb->memory_max_speed) {
        $issues['ram'][] = __('compatibility.ram_speed_exceeds_mb_max', [
          'ram_freq' => $ram->frequency,
          'mb_max' => $mb->memory_max_speed,
        ]);
        $issues['motherboard'][] = __('compatibility.mb_max_speed_exceeded', [
          'mb_max' => $mb->memory_max_speed,
          'ram_freq' => $ram->frequency,
        ]);
      }
    }

    // gpu / case length
    if ($gpu && $case && $gpu->length_mm !== null && $case->max_gpu_length !== null) {
      if ($gpu->length_mm > $case->max_gpu_length) {
        $issues['gpu'][] = __('compatibility.gpu_too_long', [
          'gpu_length' => $gpu->length_mm,
          'case_max_length' => $case->max_gpu_length,
        ]);
        $issues['case'][] = __('compatibility.case_too_small_gpu', [
          'case_max_length' => $case->max_gpu_length,
          'gpu_length' => $gpu->length_mm,
        ]);
      }
    }

    // cooler / case height
    if ($cooler && $case && $cooler->height_mm !== null && $case->max_cpu_cooler_height !== null) {
      if ($cooler->height_mm > $case->max_cpu_cooler_height) {
        $issues['cooler'][] = __('compatibility.cooler_too_tall', [
          'cooler_height' => $cooler->height_mm,
          'case_max_height' => $case->max_cpu_cooler_height,
        ]);
        $issues['case'][] = __('compatibility.case_too_small_cooler', [
          'case_max_height' => $case->max_cpu_cooler_height,
          'cooler_height' => $cooler->height_mm,
        ]);
      }
    }

    // cooler / cpu socket
    if ($cooler && $cpu && $cooler->compatibility) {
      if (!in_array($cpu->socket, explode(',', $cooler->compatibility))) {
        $issues['cooler'][] = __('compatibility.cooler_incompatible_socket', [
          'socket' => $cpu->socket,
        ]);
        $issues['cpu'][] = __('compatibility.cpu_incompatible_cooler');
      }
    }

    // cooler / cpu tdp
    if ($cooler && $cpu && $cooler->tdp_support !== null && $cpu->tdp !== null) {
      if ($cooler->tdp_support < $cpu->tdp) {
        $issues['cooler'][] = __('compatibility.cooler_tdp_too_low', [
          'cooler_tdp' => $cooler->tdp_support,
          'cpu_tdp' => $cpu->tdp,
        ]);
        $issues['cpu'][] = __('compatibility.cpu_tdp_too_high', [
          'cpu_tdp' => $cpu->tdp,
          'cooler_tdp' => $cooler->tdp_support,
        ]);
      }
    }

    // motherboard / case form factor
    if ($mb && $case && $mb->form_factor && $case->form_factor) {
      $effectiveCaseFormFactor = CompatibilityHelper::isKnownCaseFormFactor($case->form_factor)
        ? $case->form_factor
        : (CompatibilityHelper::inferKnownCaseFormFactor($case->form_factor) ?? 'mITX');

      $compatibleMotherboards = CompatibilityHelper::compatibleMotherboardsFor($effectiveCaseFormFactor);
      if (!empty($compatibleMotherboards) && !in_array($mb->form_factor, $compatibleMotherboards)) {
        $issues['motherboard'][] = __('compatibility.motherboard_form_factor_incompatible', [
          'mb_form' => $mb->form_factor,
          'case_form' => $case->form_factor,
        ]);
        $issues['case'][] = __('compatibility.case_form_factor_incompatible', [
          'case_form' => $case->form_factor,
          'mb_form' => $mb->form_factor,
        ]);
      }
    }

    // motherboard form factor with no compatible case in stock
    if ($mb && ! $case && $mb->form_factor) {
      $compatibleCases = CompatibilityHelper::compatibleCasesFor($mb->form_factor);
      if (! empty($compatibleCases) && ! PcCase::whereIn('form_factor', $compatibleCases)->exists()) {
        $issues['motherboard'][] = __('compatibility.motherboard_no_case_support', [
          'mb_form' => $mb->form_factor,
        ]);
      }
    }

    // case form factor with no compatible motherboard in stock
    if ($case && ! $mb && $case->form_factor) {
      $compatibleMbs = CompatibilityHelper::compatibleMotherboardsFor($case->form_factor);
      if (! empty($compatibleMbs) && ! Motherboard::whereIn('form_factor', $compatibleMbs)->exists()) {
        $issues['case'][] = __('compatibility.case_no_motherboard_support', [
          'case_form' => $case->form_factor,
        ]);
      }
    }

    // psu / case form factor (ATX cases require ATX PSU)
    if ($psu && $case && $psu->psu_type && $case->form_factor) {
      if (CompatibilityHelper::isAtxCaseFormFactor($case->form_factor) && $psu->psu_type !== 'ATX') {
        $issues['psu'][] = __('compatibility.psu_form_factor_atx_case', [
          'psu_type' => $psu->psu_type,
          'case_form' => $case->form_factor,
        ]);
        $issues['case'][] = __('compatibility.case_psu_form_factor_mismatch', [
          'case_form' => $case->form_factor,
          'psu_type' => $psu->psu_type,
        ]);
      }
    }

    // gpu / psu power connectors
    if ($gpu && $psu && $gpu->power_connectors) {
      $gpuConn = CompatibilityHelper::parseGpuConnectors($gpu->power_connectors);

      if ($gpuConn['requires_16pin'] && !$psu->pcie_5) {
        $issues['gpu'][] = __('compatibility.gpu_needs_pcie5_connector');
        $issues['psu'][] = __('compatibility.psu_missing_pcie5_connector');
      }

      if ($gpuConn['required_traditional'] > 0 && $psu->pcie_connectors) {
        $psuConn = CompatibilityHelper::parsePsuPcieConnectors($psu->pcie_connectors);
        if ($psuConn < $gpuConn['required_traditional']) {
          $issues['gpu'][] = __('compatibility.gpu_insufficient_pcie_connectors', [
            'required' => $gpuConn['required_traditional'],
            'available' => $psuConn,
          ]);
          $issues['psu'][] = __('compatibility.psu_insufficient_pcie_connectors', [
            'available' => $psuConn,
            'required' => $gpuConn['required_traditional'],
          ]);
        }
      }
    }

    // m.2 ssd / motherboard slots
    if ($ssd && $mb && $ssd->form_factor === 'M.2' && $mb->m2_slots === 0) {
      $issues['ssd'][] = __('compatibility.ssd_no_m2_slots');
      $issues['motherboard'][] = __('compatibility.motherboard_no_m2_slots');
    }

    // sata ssd / motherboard sata ports
    if ($ssd && $mb && str_contains(strtolower($ssd->interface ?? ''), 'sata') && $mb->sata_ports === 0) {
      $issues['ssd'][] = __('compatibility.ssd_no_sata_ports');
      $issues['motherboard'][] = __('compatibility.motherboard_no_sata_ports_ssd');
    }

    // sata device count / motherboard sata ports
    if ($mb && $mb->sata_ports !== null) {
      $sataCount = 0;
      if ($hdd && str_contains(strtolower($hdd->interface ?? ''), 'sata')) {
        $sataCount++;
      }
      if ($ssd && str_contains(strtolower($ssd->interface ?? ''), 'sata')) {
        $sataCount++;
      }
      if ($sataCount > $mb->sata_ports) {
        $issues['motherboard'][] = __('compatibility.motherboard_sata_ports_exceeded', [
          'count' => $sataCount,
          'ports' => $mb->sata_ports,
        ]);
      }
    }

    // hdd / motherboard sata ports
    if ($hdd && $mb && str_contains(strtolower($hdd->interface ?? ''), 'sata') && $mb->sata_ports === 0) {
      $issues['hdd'][] = __('compatibility.hdd_no_sata_ports');
      $issues['motherboard'][] = __('compatibility.motherboard_no_sata_ports_hdd');
    }

    // hdd / case 3.5" bays
    if ($hdd && $case && $case->bays_35 === 0) {
      $issues['hdd'][] = __('compatibility.hdd_no_35_bays');
      $issues['case'][] = __('compatibility.case_no_35_bays');
    }

    // case with built-in PSU and a separate PSU are both selected
    if ($psu && $case?->psu_included) {
      $issues['psu'][] = __('compatibility.psu_and_case_psu_conflict');
      $issues['case'][] = __('compatibility.case_psu_already_included');
    }

    // use case psu_wattage when no separate PSU is selected but case includes one
    $effectivePsuWattage = $psu?->wattage ?? ($case?->psu_included ? $case->psu_wattage : null);
    if ($effectivePsuWattage !== null && $gpu) {
      $ramWattage = ($ram?->modules_count ?? 0) * 5;
      $fanWattage = ($fan?->units_in_package ?? 0) * 3;

      $tdpRequired = ($cpu && $cpu->tdp !== null && $gpu->tdp !== null)
        ? ($cpu->tdp + $gpu->tdp + $ramWattage + $fanWattage) * 1.3
        : 0;
      $minPsuRequired = $gpu->min_psu ?? 0;
      $requiredWattage = max($tdpRequired, $minPsuRequired);

      if ($requiredWattage > 0 && $effectivePsuWattage < $requiredWattage) {
        $targetKey = $psu ? 'psu' : 'case';
        $issues[$targetKey][] = __('compatibility.psu_insufficient_wattage', [
          'psu_wattage' => $effectivePsuWattage,
          'required' => ceil($requiredWattage),
        ]);
        if ($cpu) {
          $issues['cpu'][] = __('compatibility.cpu_psu_wattage_too_low');
        }
        $issues['gpu'][] = __('compatibility.gpu_psu_wattage_too_low');
      }
    }

    return ['issues' => $issues, 'warnings' => $warnings];
  }
}
