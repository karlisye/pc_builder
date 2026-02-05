<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Gpu extends Model
{    
    protected $fillable = [
        'category',
        'name',
        'price',
        'availability',
        'gpu_model',
        'gpu_speed',
        'power_connector',
        'memory',
        'memory_type',
        'cooling'
    ];
}
