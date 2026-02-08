<?php

namespace App\Services\ComponentSelectors;

use App\Models\Cases;
use App\Helpers\CompatibilityHelper;

class CaseSelector
{
    protected $compatibilityHelper;

    public function __construct(CompatibilityHelper $compatibilityHelper)
    {
        $this->compatibilityHelper = $compatibilityHelper;
    }

    public function select($budget, $mobo)
    {
        $moboFormFactor = $mobo->form_factor;
        $compatibleCases = $this->compatibilityHelper->getCompatibleCaseFormFactors($moboFormFactor);

        // Try to find compatible case
        $case = $this->selectCompatible($budget, $compatibleCases);
        if ($case) return $case;

        // Fallback: any case within budget
        return $this->selectAny($budget);
    }

    protected function selectCompatible($budget, $compatibleCases)
    {
        return Cases::whereNotNull('price')
            ->where('price', '<=', $budget)
            ->where(function($query) use ($compatibleCases) {
                foreach ($compatibleCases as $formFactor) {
                    $query->orWhere('form_factor', 'LIKE', "%{$formFactor}%");
                }
            })
            ->orderBy('price', 'desc')
            ->first();
    }

    protected function selectAny($budget)
    {
        return Cases::whereNotNull('price')
            ->where('price', '<=', $budget)
            ->orderBy('price', 'desc')
            ->first();
    }
}
