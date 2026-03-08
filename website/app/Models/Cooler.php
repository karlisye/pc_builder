<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Cooler extends Model
{
    public $timestamps = false;

    protected $table = 'coolers';

    protected $fillable = [
        'dateks_id',
        'url',
        'name',
        'price',
        'in_stock',
        'stock_quantity',
        'compatibility',
        'tdp_support',
        'height_mm',
        'fan_size_mm',
        'scraped_at',
    ];

    protected $casts = [
        'in_stock' => 'boolean',
        'price'    => 'decimal:2',
    ];
}
