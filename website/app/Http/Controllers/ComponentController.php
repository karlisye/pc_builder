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

class ComponentController extends Controller
{
    public function show(string $component, Request $request)
    {
        $search = $request->query('search', '');

        $query = match($component) {
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

        $data = $query
            ->when($search, fn($q) => $q->where('name', 'like', "%{$search}%"))
            ->paginate(15);

        return response()->json([
            $component => $data
        ]);
    }
}
