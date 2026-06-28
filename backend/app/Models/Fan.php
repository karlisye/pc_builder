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
    'ean',
    'brand',
    'image_url',
    'size_mm',
    'connector',
    'rpm_max',
    'rpm_min',
    'units_in_package',
    'rgb_type',
    'led_color',
    'noise_max_db',
    'scraped_at',
  ];

  protected $casts = [];
}
