<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ssd extends Model
{
    protected $table = 'ssds';
    public $timestamps = false;
    
    protected $fillable = [
        'category',
        'name',
        'price',
        'availability',
        'capacity',
        'type',
        'read_speed',
        'write_speed',
        'form_factor',
        'interface',
        'scraped_at'
    ];
    
    protected $casts = [
        'price' => 'decimal:2',
        'capacity' => 'integer',
        'read_speed' => 'integer',
        'write_speed' => 'integer',
        'scraped_at' => 'datetime',
    ];
}
