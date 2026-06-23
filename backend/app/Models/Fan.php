<?php

namespace App\Models;

use App\Models\Concerns\HasListings;
use Illuminate\Database\Eloquent\Model;

class Fan extends Model
{
  use HasListings;

  public $timestamps = false;

  protected $table = 'fans';

  protected $appends = ['price', 'stock_status', 'stock_quantity', 'url'];

  protected $fillable = [
    'product_code',
    'name',
    'size_mm',
    'connector',
    'rpm_max',
    'units_in_package',
    'scraped_at',
  ];

  protected $casts = [];
}
