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

        $query = "";

        if ($component === 'motherboard') {
            if ($locked["cpu"]) {
            }
        }

        return response()->json(["locked" => $locked]);
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
