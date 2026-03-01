<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Cases extends Model
{
    protected $table = 'cases';
    public $timestamps = false;
    
    protected $fillable = [
        'category',
        'name',
        'url',
        'price',
        'availability',
        'form_factor',
        'case_type',
        'color',
        'psu_included',
        'scraped_at'
    ];
    
    protected $casts = [
        'price' => 'decimal:2',
        'scraped_at' => 'datetime',
    ];
}
