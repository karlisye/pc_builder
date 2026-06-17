<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Motherboard extends Model
{
  public $timestamps = false;

  protected $table = 'motherboards';

  protected $fillable = [
    'dateks_id',
    'url',
    'name',
    'price',
    'stock_status',
    'stock_quantity',
    'socket',
    'chipset',
    'form_factor',
    'memory_type',
    'memory_slots',
    'memory_max_speed',
    'm2_slots',
    'sata_ports',
    'wifi',
    'scraped_at',
  ];

  protected $casts = [
    'wifi' => 'boolean',
    'price' => 'decimal:2',
  ];
}
