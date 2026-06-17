<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BuildLike extends Model
{
  protected $table = 'build_likes';

  protected $fillable = [
    'user_id',
    'build_id'
  ];

  public function build(): BelongsTo
  {
    return $this->belongsTo(Build::class);
  }
}
