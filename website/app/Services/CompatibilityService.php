<?php

namespace App\Services;

use App\Helpers\CompatibilityHelper;
use App\Models\{Cpu, Motherboard, Ram, Gpu, Ssd, Hdd, PcCase, Fan, Psu, Cooler};
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;

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

        // get only available components
        $query = $modelClass::query()
            ->whereNotNull('price')
            ->where('in_stock', true);

        // add filters for the specific component
        $query = match ($type) {
            'cpu' => ComponentFilters::cpu($query, $selected),
            'motherboard' => ComponentFilters::motherboard($query, $selected),
            'ram' => ComponentFilters::ram($query, $selected),
            'gpu' => ComponentFilters::gpu($query, $selected),
            'case' => ComponentFilters::case($query, $selected),
            'cooler' => ComponentFilters::cooler($query, $selected),
            'psu' => ComponentFilters::psu($query, $selected),

            // ssd, hdd, fan - no compatibility rules yet. Add later

            default => $query,
        };

        $query = ComponentQueryFilter::apply($query, $type, $filters);

        // e.g. if user already has cpu selected, but still wants to see cpus, will return the cpu id
        $selectedIdForType = isset($selected[$type]) ? $selected[$type]->id : null;
        $warning  = CompatibilityHelper::exoticFormFactorWarning($selected);

        $paginator = $query->paginate(15);

        // add the selected boolean and manual check warning to each component
        $paginator->getCollection()->transform(function ($item) use ($selectedIdForType, $warning) {
            $item->selected = ($item->id === $selectedIdForType);
            $item->compatibility_warning = $warning;
            return $item;
        });

        return $paginator;
    }
}
