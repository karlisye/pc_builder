<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BuildReview extends Model
{
  protected $table = 'build_reviews';

  protected $fillable = [
    'user_id',
    'build_id',
    'rating'
  ];
}
