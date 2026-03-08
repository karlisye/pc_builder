<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Fan extends Model
{
    public $timestamps = false;

    protected $table = 'fans';

    protected $fillable = [
        'dateks_id',
        'url',
        'name',
        'price',
        'in_stock',
        'stock_quantity',
        'size_mm',
        'connector',
        'rpm_max',
        'units_in_package',
        'scraped_at',
    ];

    protected $casts = [
        'in_stock' => 'boolean',
        'price'    => 'decimal:2',
    ];
}
