<?php

namespace App\Http\Controllers;

use App\Models\Motherboard;
use Illuminate\Http\Request;

class ComponentController extends Controller
{
    public function getMotherboards(Request $request)
    {
        $mobos = Motherboard::paginate(50);

        return response()->json([
            'motherboard' => $mobos
        ]);
    }
}
