<?php

namespace App\Models;

use App\Models\Concerns\HasListings;
use Illuminate\Database\Eloquent\Model;

class Ram extends Model
{
  use HasListings;

  public $timestamps = false;

  protected $table = 'rams';

  protected $appends = ['price', 'stock_status', 'stock_quantity', 'url'];

  protected $fillable = [
    'product_code',
    'name',
    'memory_type',
    'capacity',
    'frequency',
    'cl_latency',
    'modules_count',
    'scraped_at',
  ];

  protected $casts = [];
}
