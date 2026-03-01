<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Cooler extends Model
{
    protected $table = 'coolers';
    public $timestamps = false;
    
    protected $fillable = [
        'category',
        'name',
        'url',
        'price',
        'availability',
        'manufacturer',
        'height',
        'tdp',
        'cooler_class',
        'led_color',
        'fan_count',
        'scraped_at'
    ];
    
    protected $casts = [
        'price' => 'decimal:2',
        'height' => 'integer',
        'tdp' => 'integer',
        'fan_count' => 'integer',
        'scraped_at' => 'datetime',
    ];
}
