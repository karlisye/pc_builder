<?php

namespace App\Helpers;

class CompatibilityHelper
{
    public function check($cpu, $mobo, $ram, $case)
    {
        return [
            'cpu_socket' => $cpu->socket,
            'mobo_socket' => $mobo->socket,
            'socket_match' => $cpu->socket === $mobo->socket,
            'mobo_memory_type' => $mobo->memory_type,
            'ram_memory_type' => $ram->memory_type,
            'memory_type_match' => $mobo->memory_type === $ram->memory_type,
            'mobo_form_factor' => $mobo->form_factor,
            'case_form_factor' => $case->form_factor ?? 'ATX',
            'case_compatibility' => $this->checkCaseCompatibility($mobo, $case)
        ];
    }

    public function getCompatibleCaseFormFactors($moboFormFactor)
    {
        $compatibility = [
            'E-ATX' => ['E-ATX', 'Full Tower'],
            'ATX' => ['ATX', 'Mid Tower', 'Full Tower'],
            'Micro-ATX' => ['Micro-ATX', 'ATX', 'Mid Tower', 'Full Tower'],
            'Mini-ITX' => ['Mini-ITX', 'Micro-ATX', 'ATX', 'Mid Tower', 'Full Tower']
        ];

        return $compatibility[$moboFormFactor] ?? ['ATX', 'Mid Tower'];
    }

    protected function checkCaseCompatibility($mobo, $case)
    {
        if (!$case || !$case->form_factor) {
            return 'Unknown';
        }

        $compatibleFormFactors = $this->getCompatibleCaseFormFactors($mobo->form_factor);

        foreach ($compatibleFormFactors as $formFactor) {
            if (stripos($case->form_factor, $formFactor) !== false) {
                return 'Compatible';
            }
        }

        return 'Check manually';
    }
}
