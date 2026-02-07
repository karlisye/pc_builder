<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Motherboard extends Model
{
    protected $table = 'motherboards';
    public $timestamps = false;
    
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
        'wifi',
        'scraped_at'
    ];
    
    protected $casts = [
        'price' => 'decimal:2',
        'memory_slots' => 'integer',
        'scraped_at' => 'datetime',
    ];
}
