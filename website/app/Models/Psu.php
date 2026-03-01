<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Psu extends Model
{
    protected $table = 'psus';
    public $timestamps = false;
    
    protected $fillable = [
        'category',
        'name',
        'url',
        'price',
        'availability',
        'manufacturer',
        'wattage',
        'certification',
        'fan_size',
        'modular',
        'cpu_connector',
        'pcie_connector',
        'scraped_at'
    ];
    
    protected $casts = [
        'price' => 'decimal:2',
        'wattage' => 'integer',
        'fan_size' => 'integer',
        'scraped_at' => 'datetime',
    ];
}
