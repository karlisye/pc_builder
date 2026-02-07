<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Fan extends Model
{
    protected $table = 'fans';
    public $timestamps = false;
    
    protected $fillable = [
        'category',
        'name',
        'price',
        'availability',
        'manufacturer',
        'rpm_max',
        'rpm_min',
        'size',
        'led_color',
        'connector',
        'quantity',
        'noise_level',
        'scraped_at'
    ];
    
    protected $casts = [
        'price' => 'decimal:2',
        'rpm_max' => 'integer',
        'rpm_min' => 'integer',
        'size' => 'integer',
        'quantity' => 'integer',
        'scraped_at' => 'datetime',
    ];
}
