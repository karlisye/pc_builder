<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BuildBookmark extends Model
{
    protected $table = 'build_bookmarks';

    protected $fillable = [
        'user_id',
        'build_id'
    ];
}
