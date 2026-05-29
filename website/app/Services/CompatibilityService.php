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

    foreach ($selectedIds as $type => $dateksId) {
      // check if selected types exist in VALID_TYPES
      if (! array_key_exists($type, self::VALID_TYPES)) {
        throw new \InvalidArgumentException(
          "'{$type}' is not a valid component type - valid types are: "
            . implode(', ', array_keys(self::VALID_TYPES))
        );
      }

      // check if component exists with the id
      $modelClass = self::VALID_TYPES[$type];
      $model = $modelClass::where('dateks_id', $dateksId)->first();
      if (!$model) {
        throw new \InvalidArgumentException("No {$type} found with dateks_id {$dateksId}");
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
      $issues['cpu'][] = "Socket mismatch with motherboard ({$cpu->socket} vs {$mb->socket})";
      $issues['motherboard'][] = "Socket mismatch with CPU ({$mb->socket} vs {$cpu->socket})";
    }

    // motherboard / ram memory type
    if ($mb && $ram && $mb->memory_type !== $ram->memory_type) {
      $issues['motherboard'][] = "Memory type mismatch with RAM ({$mb->memory_type} vs {$ram->memory_type})";
      $issues['ram'][] = "Memory type mismatch with motherboard ({$ram->memory_type} vs {$mb->memory_type})";
    }

    // gpu / case length
    if ($gpu && $case && $gpu->length_mm !== null && $case->max_gpu_length !== null) {
      if ($gpu->length_mm > $case->max_gpu_length) {
        $issues['gpu'][] = "Too long for case ({$gpu->length_mm}mm vs {$case->max_gpu_length}mm max)";
        $issues['case'][] = "Too small for GPU ({$case->max_gpu_length}mm max vs {$gpu->length_mm}mm)";
      }
    }

    // cooler / case height
    if ($cooler && $case && $cooler->height_mm !== null && $case->max_cpu_cooler_height !== null) {
      if ($cooler->height_mm > $case->max_cpu_cooler_height) {
        $issues['cooler'][] = "Too tall for case ({$cooler->height_mm}mm vs {$case->max_cpu_cooler_height}mm max)";
        $issues['case'][] = "Too small for cooler ({$case->max_cpu_cooler_height}mm max vs {$cooler->height_mm}mm)";
      }
    }

    // cooler / cpu socket
    if ($cooler && $cpu && $cooler->compatibility) {
      if (!in_array($cpu->socket, explode(',', $cooler->compatibility))) {
        $issues['cooler'][] = "Not compatible with CPU socket ({$cpu->socket})";
        $issues['cpu'][] = "Not compatible with cooler socket";
      }
    }

    // cooler / cpu tdp
    if ($cooler && $cpu && $cooler->tdp_support !== null && $cpu->tdp !== null) {
      if ($cooler->tdp_support < $cpu->tdp) {
        $issues['cooler'][] = "TDP rating too low ({$cooler->tdp_support}W vs {$cpu->tdp}W required)";
        $issues['cpu'][] = "TDP too high for cooler ({$cpu->tdp}W vs {$cooler->tdp_support}W max)";
      }
    }

    // motherboard / case form factor
    if ($mb && $case) {
      $compatibleCases = CompatibilityHelper::compatibleCasesFor($mb->form_factor);
      if (!empty($compatibleCases) && !in_array($case->form_factor, $compatibleCases)) {
        $issues['motherboard'][] = "Form factor incompatible with case ({$mb->form_factor} vs {$case->form_factor})";
        $issues['case'][] = "Form factor incompatible with motherboard ({$case->form_factor} vs {$mb->form_factor})";
      }
    }

    // psu wattage
    if ($psu && $cpu && $gpu) {
      $tdpRequired = ($cpu->tdp + $gpu->tdp) * 1.3;
      $minPsuRequired = $gpu->min_psu ?? 0;
      $requiredWattage = max($tdpRequired, $minPsuRequired);

      if ($psu->wattage !== null && $psu->wattage < $requiredWattage) {
        $issues['psu'][] = "Insufficient wattage ({$psu->wattage}W vs " . ceil($requiredWattage) . "W required)";
        $issues['cpu'][] = "PSU wattage too low for this CPU+GPU combination";
        $issues['gpu'][] = "PSU wattage too low for this CPU+GPU combination";
      }
    }

    // gpu min_psu check without cpu
    if ($psu && $gpu && !$cpu && $gpu->min_psu !== null) {
      if ($psu->wattage !== null && $psu->wattage < $gpu->min_psu) {
        $issues['psu'][] = "Insufficient wattage for GPU ({$psu->wattage}W vs {$gpu->min_psu}W required)";
        $issues['gpu'][] = "PSU wattage too low ({$psu->wattage}W vs {$gpu->min_psu}W required)";
      }
    }

    return $issues;
  }
}
