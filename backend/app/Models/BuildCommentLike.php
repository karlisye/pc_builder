<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BuildCommentLike extends Model
{
  protected $table = 'build_comment_likes';

  protected $fillable = [
    'user_id',
    'comment_id',
  ];

  public function comment(): BelongsTo
  {
    return $this->belongsTo(BuildComment::class, 'comment_id');
  }
}
