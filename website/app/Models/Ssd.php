<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ssd extends Model
{
  public $timestamps = false;

  protected $table = 'ssds';

  protected $fillable = [
    'dateks_id',
    'url',
    'name',
    'price',
    'stock_status',
    'stock_quantity',
    'capacity',
    'type',
    'form_factor',
    'interface',
    'read_speed',
    'write_speed',
    'scraped_at',
  ];

  protected $casts = [
    'price' => 'decimal:2',
  ];
}
