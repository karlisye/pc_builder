<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ram extends Model
{
    protected $table = 'rams';
    public $timestamps = false;
    
    protected $fillable = [
        'category',
        'name',
        'price',
        'availability',
        'capacity',
        'frequency',
        'memory_type',
        'cas_latency',
        'kit_type',
        'scraped_at'
    ];
    
    protected $casts = [
        'price' => 'decimal:2',
        'capacity' => 'integer',
        'frequency' => 'integer',
        'cas_latency' => 'integer',
        'scraped_at' => 'datetime',
    ];
}
