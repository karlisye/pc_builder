<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Cases extends Model
{
    protected $table = 'cases';
    
    protected $fillable = [
        'category',
        'name',
        'price',
        'availability',
        'form_factor',
        'case_type',
        'color',
        'psu_included'
    ];
}
