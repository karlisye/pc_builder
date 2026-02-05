<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ssd extends Model
{
    protected $table = 'ssd';
    
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
        'interface'
    ];
}
