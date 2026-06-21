<?php

return [
    'cpu_socket_mismatch' => 'Socket mismatch with motherboard (:cpu_socket vs :mb_socket)',
    'motherboard_socket_mismatch' => 'Socket mismatch with CPU (:mb_socket vs :cpu_socket)',
    'motherboard_memory_mismatch' => 'Memory type mismatch with RAM (:mb_type vs :ram_type)',
    'ram_memory_mismatch' => 'Memory type mismatch with motherboard (:ram_type vs :mb_type)',
    'gpu_too_long' => 'Too long for case (:gpu_length mm vs :case_max_length mm max)',
    'case_too_small_gpu' => 'Too small for GPU (:case_max_length mm max vs :gpu_length mm)',
    'cooler_too_tall' => 'Too tall for case (:cooler_height mm vs :case_max_height mm max)',
    'case_too_small_cooler' => 'Too small for cooler (:case_max_height mm max vs :cooler_height mm)',
    'cooler_incompatible_socket' => 'Not compatible with CPU socket (:socket)',
    'cpu_incompatible_cooler' => 'Not compatible with cooler socket',
    'cooler_tdp_too_low' => 'TDP rating too low (:cooler_tdp W vs :cpu_tdp W required)',
    'cpu_tdp_too_high' => 'TDP too high for cooler (:cpu_tdp W vs :cooler_tdp W max)',
    'motherboard_form_factor_incompatible' => 'Form factor incompatible with case (:mb_form vs :case_form)',
    'case_form_factor_incompatible' => 'Form factor incompatible with motherboard (:case_form vs :mb_form)',
    'psu_insufficient_wattage' => 'Insufficient wattage (:psu_wattage W vs :required W required)',
    'cpu_psu_wattage_too_low' => 'PSU wattage too low for this CPU+GPU combination',
    'gpu_psu_wattage_too_low' => 'PSU wattage too low for this CPU+GPU combination',
    'psu_insufficient_wattage_gpu_only' => 'Insufficient wattage for GPU (:psu_wattage W vs :gpu_min_psu W required)',
    'gpu_psu_wattage_too_low_specific' => 'PSU wattage too low (:psu_wattage W vs :gpu_min_psu W required)',
];
