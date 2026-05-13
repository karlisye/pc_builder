<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Gpu extends Model
{
  public $timestamps = false;

  protected $table = 'gpus';

  protected $fillable = [
    'dateks_id',
    'url',
    'name',
    'price',
    'stock_status',
    'stock_quantity',
    'type',
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

  protected $casts = [
    'price' => 'decimal:2',
  ];
}
