<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BuildBookmark extends Model
{
  protected $table = 'build_bookmarks';

  protected $fillable = [
    'user_id',
    'build_id'
  ];

  public function build(): BelongsTo
  {
    return $this->belongsTo(Build::class);
  }
}
