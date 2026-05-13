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
    'stock_status',
    'stock_quantity',
    'size_mm',
    'connector',
    'rpm_max',
    'units_in_package',
    'scraped_at',
  ];

  protected $casts = [
    'price' => 'decimal:2',
  ];
}
