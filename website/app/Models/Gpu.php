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
    'in_stock',
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
    'in_stock' => 'boolean',
    'price' => 'decimal:2',
  ];
}
