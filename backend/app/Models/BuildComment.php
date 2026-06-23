<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class BuildComment extends Model
{
  protected $table = 'build_comments';

  protected $fillable = [
    'user_id',
    'build_id',
    'parent_id',
    'body',
  ];

  public function build(): BelongsTo
  {
    return $this->belongsTo(Build::class);
  }

  public function user(): BelongsTo
  {
    return $this->belongsTo(User::class);
  }

  public function parent(): BelongsTo
  {
    return $this->belongsTo(BuildComment::class, 'parent_id');
  }

  public function replies(): HasMany
  {
    return $this->hasMany(BuildComment::class, 'parent_id')->orderBy('created_at');
  }

  public function likes(): HasMany
  {
    return $this->hasMany(BuildCommentLike::class, 'comment_id');
  }
}
