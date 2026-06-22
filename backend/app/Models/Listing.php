<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Listing extends Model
{
  public $timestamps = false;

  protected $table = 'listings';

  protected $fillable = [
    'component_type',
    'product_code',
    'source',
    'url',
    'price',
    'stock_status',
    'stock_quantity',
    'scraped_at',
  ];

  protected $casts = [
    'price' => 'decimal:2',
  ];
}
