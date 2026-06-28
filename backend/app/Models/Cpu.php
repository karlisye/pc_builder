<?php

namespace App\Models;

use App\Models\Concerns\HasListings;
use Illuminate\Database\Eloquent\Model;

class Cpu extends Model
{
  use HasListings;

  public $timestamps = false;

  protected $table = 'cpus';

  protected $appends = ['price', 'stock_status', 'stock_quantity', 'url'];

  protected $fillable = [
    'product_code',
    'name',
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
    'integrated_graphics' => 'boolean',
    'cooler_included' => 'boolean',
  ];
}
