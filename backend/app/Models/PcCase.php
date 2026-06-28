<?php

namespace App\Models;

use App\Models\Concerns\HasListings;
use Illuminate\Database\Eloquent\Model;

class PcCase extends Model
{
  use HasListings;

  public $timestamps = false;

  protected $table = 'cases';

  protected $appends = ['price', 'stock_status', 'stock_quantity', 'url'];

  protected $fillable = [
    'product_code',
    'name',
    'ean',
    'brand',
    'image_url',
    'form_factor',
    'max_gpu_length',
    'max_cpu_cooler_height',
    'bays_25',
    'bays_35',
    'psu_wattage',
    'psu_included',
    'fans_included',
    'max_psu_length',
    'max_radiator_size',
    'scraped_at',
  ];

  protected $casts = [];
}
