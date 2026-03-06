<?php

namespace App\Http\Controllers;

use App\Models\Cases;
use App\Models\Cooler;
use App\Models\Fan;
use App\Models\Gpu;
use App\Models\Motherboard;
use App\Models\Processor;
use App\Models\Psu;
use App\Models\Ram;
use App\Models\Ssd;
use Illuminate\Http\Request;
use App\Helpers\CompatibilityHelper;

class ComponentController extends Controller
{
    public function add(string $component, Request $request)
    {
        $locked = $request->all();

        $processor   = isset($locked['processor'])   ? Processor::find($locked['processor'])     : null;
        $ram         = isset($locked['ram'])         ? Ram::find($locked['ram'])                 : null;
        $motherboard = isset($locked['motherboard']) ? Motherboard::find($locked['motherboard']) : null;
        $gpu         = isset($locked['gpu'])         ? Gpu::find($locked['gpu'])                 : null;
        $psu         = isset($locked['psu'])         ? Psu::find($locked['psu'])                 : null;
        $ssd         = isset($locked['ssd'])         ? Ssd::find($locked['ssd'])                 : null;
        $cooler      = isset($locked['cooler'])      ? Cooler::find($locked['cooler'])           : null;
        $case        = isset($locked['case'])        ? Cases::find($locked['case'])              : null;
        $fan         = isset($locked['fan'])         ? Fan::find($locked['fan'])                 : null;

        switch ($component) {

            case 'processor':
                $query = Processor::query();
                if ($motherboard) $query->where('socket', $motherboard->socket);
                if ($cooler)      $query->whereJsonContains('supported_sockets', $cooler->socket);
                return $query->get();

            case 'motherboard':
                $query = Motherboard::query();
                if ($processor) $query->where('socket', $processor->socket);
                if ($ram)       $query->where('memory_type', $ram->memory_type);
                if ($gpu)       $query->where('pcie_version', '>=', $gpu->pcie_version);
                if ($cooler)    $query->whereJsonContains('supported_sockets', $cooler->socket);
                if ($case)      $query->where('form_factor', $case->supported_form_factors);
                if ($ssd)       $query->where('storage_interface', $ssd->interface);
                return $query->get();

            case 'ram':
                $query = Ram::query();
                if ($motherboard) $query->where('memory_type', $motherboard->memory_type);
                return $query->get();

            case 'gpu':
                $query = Gpu::query();
                if ($motherboard) $query->where('pcie_version', '<=', $motherboard->pcie_version);
                if ($psu)         $query->where('tdp', '<=', $psu->wattage * 0.6);
                if ($case)        $query->where('length', '<=', $case->max_gpu_length);
                return $query->get();

            case 'cooler':
                $query = Cooler::query();
                if ($processor)   $query->whereJsonContains('supported_sockets', $processor->socket);
                if ($motherboard) $query->whereJsonContains('supported_sockets', $motherboard->socket);
                if ($case)        $query->where('height', '<=', $case->max_cooler_height);
                return $query->get();

            case 'psu':
                $query = Psu::query();
                $totalTdp = 0;
                if ($processor) $totalTdp += $processor->tdp;
                if ($gpu)       $totalTdp += $gpu->tdp;
                if ($totalTdp > 0) $query->where('wattage', '>=', $totalTdp * 1.3);
                return $query->get();

            case 'ssd':
                $query = Ssd::query();
                if ($motherboard) $query->where('interface', $motherboard->storage_interface);
                return $query->get();

            case 'case':
                $query = Cases::query();
                if ($motherboard) $query->where('supported_form_factors', 'like', '%' . $motherboard->form_factor . '%');
                if ($cooler)      $query->where('max_cooler_height', '>=', $cooler->height);
                if ($gpu)         $query->where('max_gpu_length', '>=', $gpu->length);
                return $query->get();

            case 'fan':
                $query = Fan::query();
                if ($case) $query->where('size', '<=', $case->max_fan_size);
                return $query->get();
        }

        return response()->json(['locked' => $locked]);
    }

    public function show(string $component, Request $request)
    {
        $search = $request->query('search', '');
        $cpuId = $request->query('cpu_id');
        $motherboardId = $request->query('motherboard_id');

        $query = match ($component) {
            'processor' => Processor::query(),
            'graphicscard' => Gpu::query(),
            'cooler' => Cooler::query(),
            'motherboard' => Motherboard::query(),
            'ram' => Ram::query(),
            'powersupply' => Psu::query(),
            'ssd' => Ssd::query(),
            'case' => Cases::query(),
            'fans' => Fan::query(),
            default => abort(404),
        };

        // Apply basic compatibility filters based on already selected parts
        if ($component === 'motherboard' && $cpuId) {
            $cpu = Processor::find($cpuId);
            if ($cpu && $cpu->socket) {
                $query->where('socket', $cpu->socket);
            }
        }

        if ($component === 'processor' && $motherboardId) {
            $mobo = Motherboard::find($motherboardId);
            if ($mobo && $mobo->socket) {
                $query->where('socket', $mobo->socket);
            }
        }

        if ($component === 'ram' && $motherboardId) {
            $mobo = Motherboard::find($motherboardId);
            if ($mobo && $mobo->memory_type) {
                $query->where('memory_type', $mobo->memory_type);
            }
        }

        if ($component === 'case' && $motherboardId) {
            $mobo = Motherboard::find($motherboardId);
            if ($mobo && $mobo->form_factor) {
                $compatHelper = new CompatibilityHelper();
                $compatibleForms = $compatHelper->getCompatibleCaseFormFactors($mobo->form_factor);

                $query->where(function ($q) use ($compatibleForms) {
                    foreach ($compatibleForms as $formFactor) {
                        $q->orWhere('form_factor', 'LIKE', "%{$formFactor}%");
                    }
                });
            }
        }

        $data = $query
            ->when($search, fn($q) => $q->where('name', 'like', "%{$search}%"))
            ->paginate(15);

        return response()->json([
            $component => $data
        ]);
    }
}
