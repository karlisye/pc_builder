<?php

namespace App\Models;

use App\Models\Concerns\HasListings;
use Illuminate\Database\Eloquent\Model;

class Gpu extends Model
{
  use HasListings;

  public $timestamps = false;

  protected $table = 'gpus';

  protected $appends = ['price', 'stock_status', 'stock_quantity', 'url'];

  protected $fillable = [
    'product_code',
    'name',
    'gpu_model',
    'vram',
    'tdp',
    'min_psu',
    'pcie_version',
    'length_mm',
    'power_connectors',
    'cuda',
    'bus',
    'vram_freq',
    'scraped_at',
  ];

  protected $casts = [];
}
