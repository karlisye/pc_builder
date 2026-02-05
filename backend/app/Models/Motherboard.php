<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Motherboard extends Model
{    
    protected $fillable = [
        'category',
        'name',
        'price',
        'availability',
        'series',
        'socket',
        'chipset',
        'form_factor',
        'memory_type',
        'memory_slots',
        'wifi'
    ];
}