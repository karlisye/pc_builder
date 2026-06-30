<?php

namespace App\Models;

use App\Models\Concerns\HasListings;
use Illuminate\Database\Eloquent\Model;

class Motherboard extends Model
{
  use HasListings;

  public $timestamps = false;

  protected $table = 'motherboards';

  protected $appends = ['price', 'stock_status', 'stock_quantity', 'url'];

  protected $fillable = [
    'product_code',
    'name',
    'ean',
    'brand',
    'image_url',
    'socket',
    'chipset',
    'form_factor',
    'memory_type',
    'memory_slots',
    'memory_max_speed',
    'max_memory_capacity',
    'm2_slots',
    'sata_ports',
    'wifi',
    'scraped_at',
  ];

  protected $casts = [
    'wifi' => 'boolean',
  ];
}
