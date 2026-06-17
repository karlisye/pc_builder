<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ScrapeResult extends Model
{
  protected $table = 'scrape_results';
  public $timestamps = false;

  protected $fillable = [
    'session_id',
    'category',
    'total',
    'inserted',
    'skipped',
  ];

  public function session(): BelongsTo
  {
    return $this->belongsTo(ScrapeSession::class);
  }
}
