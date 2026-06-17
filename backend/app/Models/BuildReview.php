<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BuildReview extends Model
{
  protected $table = 'build_reviews';

  protected $fillable = [
    'user_id',
    'build_id',
    'rating'
  ];

  public function build(): BelongsTo
  {
    return $this->belongsTo(Build::class);
  }
}
