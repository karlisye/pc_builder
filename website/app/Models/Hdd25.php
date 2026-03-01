<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Hdd25 extends Model
{
    protected $table = 'hdds_25';
    public $timestamps = false;
    
    protected $fillable = [
        'category',
        'name',
        'url',
        'price',
        'availability',
        'capacity',
        'interface',
        'rpm',
        'cache',
        'scraped_at'
    ];
    
    protected $casts = [
        'price' => 'decimal:2',
        'capacity' => 'integer',
        'rpm' => 'integer',
        'cache' => 'integer',
        'scraped_at' => 'datetime',
    ];
}
