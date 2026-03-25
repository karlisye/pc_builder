<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Cpu extends Model
{
  public $timestamps = false;

  protected $table = 'cpus';

  protected $fillable = [
    'dateks_id',
    'url',
    'name',
    'price',
    'in_stock',
    'stock_quantity',
    'socket',
    'cores',
    'threads',
    'clock_rate',
    'turbo_frequency',
    'tdp',
    'integrated_graphics',
    'cooler_included',
    'passmark',
    'scraped_at',
  ];

  protected $casts = [
    'in_stock' => 'boolean',
    'integrated_graphics' => 'boolean',
    'cooler_included' => 'boolean',
    'price' => 'decimal:2',
  ];
}
