<?php

return [
    'budget_exceeded' => 'Selected components already exceed or meet the budget.',
    'no_compatible_parts' => 'Could not find compatible parts within the given budget. Estimated minimum budget needed: :amount.',
    'component_budget_too_low' => "Couldn't find compatible components within the budget. Estimated minimum budget is :amount.",
    'ram_below_recommended' => 'RAM is below recommended :capacityGB for :type builds at this budget tier.',
    'no_gpu_found' => 'No GPU was found within the budget for a :type build. Consider increasing your budget.',
    'gpu_vram_below_recommended' => 'GPU VRAM (:vramGB) is below recommended :recommendedGB for :type builds at this budget tier.',
    'ssd_too_small' => 'SSD has less than 256GB of storage, which may not provide enough space for your operating system, applications, and files.',
    'larger_ssd_recommended' => 'A larger SSD is recommended for storing modern games and applications.',
    'cpu_included_cooler' => 'CPU comes with an included cooler to save costs at this budget tier.',
    'cpu_integrated_graphics' => 'CPU comes with integrated graphics to save costs at this budget tier.',

    'types' => [
        'gaming' => 'gaming',
        'office' => 'office',
        'streaming' => 'streaming',
        'rendering' => 'rendering',
        'general' => 'general',
    ],
];
