<?php

namespace App\Models;

use App\Models\Concerns\HasListings;
use Illuminate\Database\Eloquent\Model;

class Hdd extends Model
{
  use HasListings;

  public $timestamps = false;

  protected $table = 'hdds';

  protected $appends = ['price', 'stock_status', 'stock_quantity', 'url'];

  protected $fillable = [
    'product_code',
    'name',
    'capacity',
    'interface',
    'scraped_at',
  ];

  protected $casts = [];
}
