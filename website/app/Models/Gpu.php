<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Gpu extends Model
{
    protected $table = 'gpus';
    public $timestamps = false;
    
    protected $fillable = [
        'category',
        'name',
        'url',
        'price',
        'availability',
        'gpu_model',
        'gpu_speed',
        'power_connector',
        'memory',
        'memory_type',
        'cooling',
        'scraped_at'
    ];
    
    protected $casts = [
        'price' => 'decimal:2',
        'gpu_speed' => 'integer',
        'memory' => 'integer',
        'scraped_at' => 'datetime',
    ];
}
