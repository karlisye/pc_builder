<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BuildLike extends Model
{
  protected $table = 'build_likes';

  protected $fillable = [
    'user_id',
    'build_id'
  ];
}
