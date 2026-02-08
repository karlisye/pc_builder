<?php

namespace App\Services\ComponentSelectors;

use App\Models\Ssd;

class SsdSelector
{
    public function select($budget, $relaxed = false)
    {
        if (!$relaxed) {
            $ssd = $this->selectPreferred($budget);
            if ($ssd) return $ssd;
        }

        return $this->selectFallback($budget);
    }

    protected function selectPreferred($budget)
    {
        return Ssd::whereNotNull('capacity')
            ->whereNotNull('price')
            ->where('capacity', '>=', 512)
            ->where('price', '<=', $budget)
            ->orderByDesc('capacity')
            ->orderByDesc('read_speed')
            ->first();
    }

    protected function selectFallback($budget)
    {
        return Ssd::whereNotNull('capacity')
            ->whereNotNull('price')
            ->where('price', '<=', $budget)
            ->orderByDesc('capacity')
            ->orderByDesc('read_speed')
            ->first();
    }
}
