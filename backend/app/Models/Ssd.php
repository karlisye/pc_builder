<?php

namespace App\Models;

use App\Models\Concerns\HasListings;
use Illuminate\Database\Eloquent\Model;

class Ssd extends Model
{
  use HasListings;

  public $timestamps = false;

  protected $table = 'ssds';

  protected $appends = ['price', 'stock_status', 'stock_quantity'];

  protected $fillable = [
    'product_code',
    'name',
    'capacity',
    'type',
    'form_factor',
    'interface',
    'read_speed',
    'write_speed',
    'scraped_at',
  ];

  protected $casts = [];
}
