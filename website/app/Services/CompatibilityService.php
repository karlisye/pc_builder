<?php

namespace App\Services;

use App\Helpers\CompatibilityHelper;
use App\Models\{Cpu, Motherboard, Ram, Gpu, Ssd, Hdd, PcCase, Fan, Psu, Cooler};
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
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

    foreach ($selectedIds as $type => $id) {
      // check if selected types exist in VALID_TYPES
      if (! array_key_exists($type, self::VALID_TYPES)) {
        throw new \InvalidArgumentException(
          "'{$type}' is not a valid component type - valid types are: "
            . implode(', ', array_keys(self::VALID_TYPES))
        );
      }

      // check if component exists with the id
      $modelClass = self::VALID_TYPES[$type];
      $resolved[$type] = $modelClass::find((int) $id);

      if ($resolved[$type] === null) {
        throw new \InvalidArgumentException(
          "no {$type} found with id {$id}"
        );
      }
    }

    return $resolved;
  }

  public function getCompatible(string $type, array $selected, array $filters = []): LengthAwarePaginator
  {
    $modelClass = self::VALID_TYPES[$type];

    // get ALL components
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
      $item->out_of_stock = !$item->in_stock;
      return $item;
    });

    return $paginator;
  }
}
