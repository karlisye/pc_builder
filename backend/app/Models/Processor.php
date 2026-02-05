<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Processor extends Model
{
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
        'cooler_included'
    ];
}
