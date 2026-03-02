<?php

namespace App\Http\Controllers;

use App\Models\Cases;
use App\Models\Gpu;
use App\Models\Motherboard;
use App\Models\Processor;
use App\Models\Psu;
use App\Models\Ram;
use Illuminate\Http\Request;

class ComponentController extends Controller
{
    public function show(string $component, Request $request)
    {
        $search = $request->query('search', '');

        $query = match($component) {
            'cpu'         => Processor::query(),
            'gpu'         => Gpu::query(),
            'motherboard' => Motherboard::query(),
            'ram'         => Ram::query(),
            'psu'         => Psu::query(),
            'case'        => Cases::query(),
            default       => abort(404),
        };

        $data = $query
            ->when($search, fn($q) => $q->where('name', 'like', "%{$search}%"))
            ->paginate(15);

        return response()->json([
            $component => $data
        ]);
    }
}
