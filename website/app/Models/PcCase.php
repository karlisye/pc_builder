<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PcCase extends Model
{
  public $timestamps = false;

  protected $table = 'cases';

  protected $fillable = [
    'dateks_id',
    'url',
    'name',
    'price',
    'stock_status',
    'stock_quantity',
    'form_factor',
    'max_gpu_length',
    'max_cpu_cooler_height',
    'bays_25',
    'bays_35',
    'psu_wattage',
    'scraped_at',
  ];

  protected $casts = [
    'price' => 'decimal:2',
  ];
}
