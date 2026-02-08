<?php

namespace App\Services\ComponentSelectors;

use App\Models\Processor;

class CpuSelector
{
    public function select($budget)
    {
        return Processor::whereNotNull('socket')
            ->whereNotNull('cores')
            ->whereNotNull('price')
            ->where('price', '<=', $budget)
            ->whereNotIn('socket', ['sWRX8', 'sTR5'])
            ->where('name', 'NOT LIKE', '%Threadripper%')
            ->where('name', 'NOT LIKE', '%PRO%')
            ->orderByDesc('cores')
            ->orderByDesc('frequency')
            ->first();
    }
}
