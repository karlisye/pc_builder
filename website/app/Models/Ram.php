<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ram extends Model
{
  public $timestamps = false;

  protected $table = 'ram';

  protected $fillable = [
    'dateks_id',
    'url',
    'name',
    'price',
    'in_stock',
    'stock_quantity',
    'memory_type',
    'capacity',
    'frequency',
    'cl_latency',
    'modules_count',
    'scraped_at',
  ];

  protected $casts = [
    'in_stock' => 'boolean',
    'price' => 'decimal:2',
  ];
}
