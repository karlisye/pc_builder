<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Hdd extends Model
{
  public $timestamps = false;

  protected $table = 'hdds';

  protected $fillable = [
    'dateks_id',
    'url',
    'name',
    'price',
    'in_stock',
    'stock_quantity',
    'capacity',
    'interface',
    'scraped_at',
  ];

  protected $casts = [
    'in_stock' => 'boolean',
    'price' => 'decimal:2',
  ];
}
