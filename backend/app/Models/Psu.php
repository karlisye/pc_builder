<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Psu extends Model
{
    protected $table = 'psu';
    
    protected $fillable = [
        'category',
        'name',
        'price',
        'availability',
        'manufacturer',
        'wattage',
        'certification',
        'fan_size',
        'modular',
        'cpu_connector',
        'pcie_connector'
    ];
}
