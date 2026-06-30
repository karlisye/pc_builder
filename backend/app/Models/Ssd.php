<?php

namespace App\Models;

use App\Models\Concerns\HasListings;
use Illuminate\Database\Eloquent\Model;

class Ssd extends Model
{
  use HasListings;

  public $timestamps = false;

  protected $table = 'ssds';

  protected $appends = ['price', 'stock_status', 'stock_quantity', 'url'];

  protected $fillable = [
    'product_code',
    'name',
    'ean',
    'brand',
    'image_url',
    'capacity',
    'type',
    'form_factor',
    'interface',
    'read_speed',
    'write_speed',
    'nand_type',
    'tbw',
    'random_read_iops',
    'random_write_iops',
    'scraped_at',
  ];

  protected $casts = [];
}
