<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ScrapeSession extends Model
{
  protected $table = 'scrape_sessions';
  public $timestamps = false;

  protected $fillable = [
    'status',
    'started_at',
    'finished_at',
  ];

  public function results(): HasMany
  {
    return $this->hasMany(ScrapeResult::class);
  }
}
