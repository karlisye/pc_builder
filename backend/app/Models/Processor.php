<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Processor extends Model
{
    protected $table = 'processors';
    public $timestamps = false;
    
    protected $fillable = [
        'category',
        'name',
        'price',
        'availability',
        'socket',
        'processor_number',
        'cores',
        'frequency',
        'cache',
        'lithography',
        'tdp',
        'cooler_included',
        'scraped_at'
    ];
    
    protected $casts = [
        'price' => 'decimal:2',
        'cores' => 'integer',
        'frequency' => 'integer',
        'cache' => 'integer',
        'lithography' => 'integer',
        'tdp' => 'integer',
        'scraped_at' => 'datetime',
    ];
}
