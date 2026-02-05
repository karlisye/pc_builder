<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ram extends Model
{
    protected $table = 'ram';
    
    protected $fillable = [
        'category',
        'name',
        'price',
        'availability',
        'capacity',
        'frequency',
        'memory_type',
        'cas_latency',
        'kit_type'
    ];
}
