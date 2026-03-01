<?php

require __DIR__ . '/vendor/autoload.php';

$app = require __DIR__ . '/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$data = [
    'cpus' => \App\Models\Processor::select('id', 'name', 'price', 'socket', 'cooler_included')->get(),
    'motherboards' => \App\Models\Motherboard::select('id', 'name', 'price', 'socket', 'memory_type')->get(),
    'ram' => \App\Models\Ram::select('id', 'name', 'price', 'memory_type', 'capacity', 'frequency')->get(),
    'gpus' => \App\Models\Gpu::select('id', 'name', 'price')->get(),
    'ssds' => \App\Models\Ssd::select('id', 'name', 'price', 'capacity')->get(),
    'psus' => \App\Models\Psu::select('id', 'name', 'price', 'wattage')->get(),
    'cases' => \App\Models\Cases::select('id', 'name', 'price', 'psu_included')->get(),
    'coolers' => \App\Models\Cooler::select('id', 'name', 'price')->get(),
    'fans' => \App\Models\Fan::select('id', 'name', 'price', 'quantity')->get(),
];

$json = json_encode($data, JSON_PRETTY_PRINT);
file_put_contents(__DIR__ . '/storage/app/db_dump.json', $json);

echo "Done! Written to storage/app/db_dump.json\n";
echo "Rows: " . collect($data)->map(fn($v) => count($v))->toJson() . "\n";
