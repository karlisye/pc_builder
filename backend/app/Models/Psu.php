<?php

namespace App\Models;

use App\Models\Concerns\HasListings;
use Illuminate\Database\Eloquent\Model;

class Psu extends Model
{
  use HasListings;

  public $timestamps = false;

  protected $table = 'psus';

  protected $appends = ['price', 'stock_status', 'stock_quantity', 'url'];

  protected $fillable = [
    'product_code',
    'name',
    'wattage',
    'efficiency_rating',
    'psu_type',
    'modular',
    'fan_size_mm',
    'pcie_connectors',
    'sata_connectors',
    'scraped_at',
  ];

  protected $casts = [];
}
