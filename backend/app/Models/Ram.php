<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ram extends Model
{
  public $timestamps = false;

  protected $table = 'rams';

  protected $fillable = [
    'dateks_id',
    'url',
    'name',
    'price',
    'stock_status',
    'stock_quantity',
    'memory_type',
    'capacity',
    'frequency',
    'cl_latency',
    'modules_count',
    'scraped_at',
  ];

  protected $casts = [
    'price' => 'decimal:2',
  ];
}
