<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Psu extends Model
{
    public $timestamps = false;

    protected $table = 'psus';

    protected $fillable = [
        'dateks_id',
        'url',
        'name',
        'price',
        'in_stock',
        'stock_quantity',
        'wattage',
        'efficiency_rating',
        'psu_type',
        'modular',
        'fan_size_mm',
        'pcie_connectors',
        'eps_connectors',
        'sata_connectors',
        'scraped_at',
    ];

    protected $casts = [
        'in_stock' => 'boolean',
        'modular'  => 'boolean',
        'price'    => 'decimal:2',
    ];
}
