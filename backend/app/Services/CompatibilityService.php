<?php

namespace App\Services;

use App\Helpers\CompatibilityHelper;
use App\Models\{Cpu, Motherboard, Ram, Gpu, Ssd, Hdd, PcCase, Fan, Psu, Cooler};
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Log;

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
    $query = $modelClass::query();

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

      // TODO: ssd, hdd, fan - no compatibility rules yet. Add later

      default => $compatibleQuery,
    };

    // get all compatible ids from query into an array
    $compatibleIds = $compatibleQuery->pluck('id')->toArray();

    $query = ComponentQueryFilter::apply($query, $type, $filters, $compatibleIds);

    // e.g. if user already has cpu selected, but still wants to see cpus, will return the cpu id
    $selectedIdForType = isset($selected[$type]) ? $selected[$type]->id : null;
    $warning  = CompatibilityHelper::exoticFormFactorWarning($selected);

    $paginator = $query->paginate(15);

    // add the selected boolean and manual check warning to each component
    // add compatible and out_of_stock flags to each component
    $paginator->getCollection()->transform(function ($item) use ($selectedIdForType, $warning, $compatibleIds) {
      $item->selected = ($item->id === $selectedIdForType);
      $item->compatibility_warning = $warning;
      $item->compatible = in_array($item->id, $compatibleIds);
      $item->out_of_stock = $item->stock_status === 'out_of_stock';
      return $item;
    });

    return $paginator;
  }

  public function validateBuild(array $selected): array
  {
    $issues = [];

    $cpu = $selected['cpu'] ?? null;
    $mb = $selected['motherboard'] ?? null;
    $ram = $selected['ram'] ?? null;
    $gpu = $selected['gpu'] ?? null;
    $case = $selected['case'] ?? null;
    $cooler = $selected['cooler'] ?? null;
    $psu = $selected['psu'] ?? null;

    // cpu / motherboard socket
    if ($cpu && $mb && $cpu->socket !== $mb->socket) {
      $issues['cpu'][] = __('compatibility.cpu_socket_mismatch', [
        'cpu_socket' => $cpu->socket, 'mb_socket' => $mb->socket,
      ]);
      $issues['motherboard'][] = __('compatibility.motherboard_socket_mismatch', [
        'mb_socket' => $mb->socket, 'cpu_socket' => $cpu->socket,
      ]);
    }

    // motherboard / ram memory type
    if ($mb && $ram && $mb->memory_type !== $ram->memory_type) {
      $issues['motherboard'][] = __('compatibility.motherboard_memory_mismatch', [
        'mb_type' => $mb->memory_type, 'ram_type' => $ram->memory_type,
      ]);
      $issues['ram'][] = __('compatibility.ram_memory_mismatch', [
        'ram_type' => $ram->memory_type, 'mb_type' => $mb->memory_type,
      ]);
    }

    // gpu / case length
    if ($gpu && $case && $gpu->length_mm !== null && $case->max_gpu_length !== null) {
      if ($gpu->length_mm > $case->max_gpu_length) {
        $issues['gpu'][] = __('compatibility.gpu_too_long', [
          'gpu_length' => $gpu->length_mm, 'case_max_length' => $case->max_gpu_length,
        ]);
        $issues['case'][] = __('compatibility.case_too_small_gpu', [
          'case_max_length' => $case->max_gpu_length, 'gpu_length' => $gpu->length_mm,
        ]);
      }
    }

    // cooler / case height
    if ($cooler && $case && $cooler->height_mm !== null && $case->max_cpu_cooler_height !== null) {
      if ($cooler->height_mm > $case->max_cpu_cooler_height) {
        $issues['cooler'][] = __('compatibility.cooler_too_tall', [
          'cooler_height' => $cooler->height_mm, 'case_max_height' => $case->max_cpu_cooler_height,
        ]);
        $issues['case'][] = __('compatibility.case_too_small_cooler', [
          'case_max_height' => $case->max_cpu_cooler_height, 'cooler_height' => $cooler->height_mm,
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
          'cooler_tdp' => $cooler->tdp_support, 'cpu_tdp' => $cpu->tdp,
        ]);
        $issues['cpu'][] = __('compatibility.cpu_tdp_too_high', [
          'cpu_tdp' => $cpu->tdp, 'cooler_tdp' => $cooler->tdp_support,
        ]);
      }
    }

    // motherboard / case form factor
    if ($mb && $case) {
      $compatibleCases = CompatibilityHelper::compatibleCasesFor($mb->form_factor);
      if (!empty($compatibleCases) && !in_array($case->form_factor, $compatibleCases)) {
        $issues['motherboard'][] = __('compatibility.motherboard_form_factor_incompatible', [
          'mb_form' => $mb->form_factor, 'case_form' => $case->form_factor,
        ]);
        $issues['case'][] = __('compatibility.case_form_factor_incompatible', [
          'case_form' => $case->form_factor, 'mb_form' => $mb->form_factor,
        ]);
      }
    }

    // psu wattage
    if ($psu && $cpu && $gpu) {
      $tdpRequired = ($cpu->tdp + $gpu->tdp) * 1.3;
      $minPsuRequired = $gpu->min_psu ?? 0;
      $requiredWattage = max($tdpRequired, $minPsuRequired);

      if ($psu->wattage !== null && $psu->wattage < $requiredWattage) {
        $issues['psu'][] = __('compatibility.psu_insufficient_wattage', [
          'psu_wattage' => $psu->wattage, 'required' => ceil($requiredWattage),
        ]);
        $issues['cpu'][] = __('compatibility.cpu_psu_wattage_too_low');
        $issues['gpu'][] = __('compatibility.gpu_psu_wattage_too_low');
      }
    }

    // gpu min_psu check without cpu
    if ($psu && $gpu && !$cpu && $gpu->min_psu !== null) {
      if ($psu->wattage !== null && $psu->wattage < $gpu->min_psu) {
        $issues['psu'][] = __('compatibility.psu_insufficient_wattage_gpu_only', [
          'psu_wattage' => $psu->wattage, 'gpu_min_psu' => $gpu->min_psu,
        ]);
        $issues['gpu'][] = __('compatibility.gpu_psu_wattage_too_low_specific', [
          'psu_wattage' => $psu->wattage, 'gpu_min_psu' => $gpu->min_psu,
        ]);
      }
    }

    return $issues;
  }
}
