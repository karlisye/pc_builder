<?php

namespace App\Services;

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

    public function getCompatible(string $type, array $selected): LengthAwarePaginator
    {
        $modelClass = self::VALID_TYPES[$type];

        // 1. get only available components
        $query = $modelClass::query()
            ->whereNotNull('price')
            ->where('in_stock', true);

        // add filters for the specific component
        $query = match ($type) {
            'cpu' => $this->filterCpus($query, $selected),
            'motherboard' => $this->filterMotherboards($query, $selected),
            'ram' => $this->filterRam($query, $selected),
            'gpu' => $this->filterGpus($query, $selected),
            'cooler' => $this->filterCoolers($query, $selected),
            'case' => $this->filterCases($query, $selected),
            'psu' => $this->filterPsus($query, $selected),

            // ssd, hdd, fan - no compatibility rules yet. Add later

            default => $query,
        };

        // e.g. if user already has cpu selected, but still wants to see cpus, will return the cpu id
        $selectedIdForType = isset($selected[$type]) ? $selected[$type]->id : null;

        $paginator = $query->paginate(15);

        // add the selected boolean to each component
        $paginator->getCollection()->transform(function ($item) use ($selectedIdForType) {
            $item->selected = ($item->id === $selectedIdForType);
            return $item;
        });

        return $paginator;
    }

    private function filterCpus(Builder $query, array $selected): Builder
    {
        if (isset($selected['motherboard'])) {
            $mb = $selected['motherboard'];
            if ($mb && $mb->socket) {
                $query->where('socket', $mb->socket);
            }
        }

        return $query;
    }

    private function filterMotherboards(Builder $query, array $selected): Builder
    {
        if (isset($selected['cpu'])) {
            $cpu = $selected['cpu'];
            if ($cpu && $cpu->socket) {
                $query->where('socket', $cpu->socket);
            }
        }

        if (isset($selected['ram'])) {
            $ram = $selected['ram'];
            if ($ram && $ram->memory_type) {
                $query->where('memory_type', $ram->memory_type);
            }
        }

        return $query;
    }

    private function filterRam(Builder $query, array $selected): Builder
    {
        if (isset($selected['motherboard'])) {
            $mb = $selected['motherboard'];
            if ($mb && $mb->memory_type) {
                $query->where('memory_type', $mb->memory_type);
            }
        }

        return $query;
    }

    private function filterGpus(Builder $query, array $selected): Builder
    {
        if (isset($selected['case'])) {
            $case = $selected['case'];
            if ($case && $case->max_gpu_length !== null) {
                $query->where(function (Builder $q) use ($case) {
                    $q->whereNull('length_mm')
                        ->orWhere('length_mm', '<=', $case->max_gpu_length);
                });
            }
        }

        return $query;
    }

    private function filterCases(Builder $query, array $selected): Builder
    {
        if (isset($selected['gpu'])) {
            $gpu = $selected['gpu'];
            if ($gpu && $gpu->length_mm !== null) {
                $query->where(function (Builder $q) use ($gpu) {
                    $q->whereNull('max_gpu_length')
                        ->orWhere('max_gpu_length', '>=', $gpu->length_mm);
                });
            }
        }

        if (isset($selected['cooler'])) {
            $cooler = $selected['cooler'];
            if ($cooler && $cooler->height_mm !== null) {
                $query->where(function (Builder $q) use ($cooler) {
                    $q->whereNull('max_cpu_cooler_height')
                        ->orWhere('max_cpu_cooler_height', '>=', $cooler->height_mm);
                });
            }
        }

        return $query;
    }

    private function filterCoolers(Builder $query, array $selected): Builder
    {
        if (isset($selected['cpu'])) {
            $cpu = $selected['cpu'];
            if ($cpu && $cpu->socket) {
                $socket = $cpu->socket;
                $query->where(function (Builder $q) use ($socket) {
                    $q->whereNull('compatibility')
                        // compatability for coolers is stored as string seperated by ',' , e.g: AM4,AM5,LGA1700,LGA1851
                        ->orWhereRaw('FIND_IN_SET(?, compatibility)', [$socket]);
                });
            }
        }

        if (isset($selected['case'])) {
            $case = $selected['case'];
            if ($case && $case->max_cpu_cooler_height !== null) {
                $query->where(function (Builder $q) use ($case) {
                    $q->whereNull('height_mm')
                        ->orWhere('height_mm', '<=', $case->max_cpu_cooler_height);
                });
            }
        }

        return $query;
    }

    private function filterPsus(Builder $query, array $selected): Builder
    {
        $cpu = $selected['cpu'] ?? null;
        $gpu = $selected['gpu'] ?? null;
        $case = $selected['case'] ?? null;

        $cpuTdp = $cpu?->tdp;
        $gpuTdp = $gpu?->tdp;

        if ($cpuTdp !== null && $gpuTdp !== null) {
            $requiredWattage = ($cpuTdp + $gpuTdp) * 1.3;

            if ($case && $case->psu_wattage > 1) {
                if ($case->psu_wattage >= $requiredWattage) {
                    // if case psu is enough - force empty result with 1=0
                    $query->whereRaw('1 = 0');
                    return $query;
                }
                // if case psu isnt powerful enough, show standalone psus
            }

            // if $case && $case->psu_wattage === 1
            // if case includes psu, but doesnt show how much wattage
            // could maybe add response to check manually. Add later.

            $query->where(function (Builder $q) use ($requiredWattage) {
                $q->whereNull('wattage')
                    ->orWhere('wattage', '>=', $requiredWattage);
            });
        }

        return $query;
    }
}
