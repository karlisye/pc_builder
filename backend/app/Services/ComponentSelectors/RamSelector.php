<?php

namespace App\Services\ComponentSelectors;

use App\Models\Ram;

class RamSelector
{
    public function select($budget, $mobo, $relaxed = false)
    {
        if (!$relaxed) {
            $ram = $this->selectPreferred($budget, $mobo);
            if ($ram) return $ram;
        }

        return $this->selectFallback($budget, $mobo);
    }

    protected function selectPreferred($budget, $mobo)
    {
        return Ram::where('memory_type', $mobo->memory_type)
            ->whereNotNull('capacity')
            ->whereNotNull('price')
            ->where('capacity', '>=', 16)
            ->where('price', '<=', $budget * 1.2)
            ->orderByDesc('capacity')
            ->orderByDesc('frequency')
            ->first();
    }

    protected function selectFallback($budget, $mobo)
    {
        return Ram::where('memory_type', $mobo->memory_type)
            ->whereNotNull('capacity')
            ->whereNotNull('price')
            ->where('capacity', '>=', 8)
            ->where('price', '<=', $budget)
            ->orderByDesc('capacity')
            ->orderByDesc('frequency')
            ->first();
    }
}
