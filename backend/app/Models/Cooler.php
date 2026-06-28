<?php

namespace App\Models;

use App\Models\Concerns\HasListings;
use Illuminate\Database\Eloquent\Model;

class Cooler extends Model
{
  use HasListings;

  public $timestamps = false;

  protected $table = 'coolers';

  protected $appends = ['price', 'stock_status', 'stock_quantity', 'url'];

  protected $fillable = [
    'product_code',
    'name',
    'ean',
    'brand',
    'image_url',
    'compatibility',
    'tdp_support',
    'height_mm',
    'fan_size_mm',
    'fan_count',
    'rpm_max',
    'rpm_min',
    'connector',
    'scraped_at',
  ];

  protected $casts = [];
}
