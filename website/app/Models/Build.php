<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Build extends Model
{
  protected $fillable = [
    'user_id',
    'name',
    'notes',
    'total_price',
    'cpu_id',
    'motherboard_id',
    'ram_id',
    'gpu_id',
    'ssd_id',
    'hdd_id',
    'case_id',
    'cooler_id',
    'psu_id',
    'fan_id',
    'is_public'
  ];

  protected $casts = [
    'total_price' => 'decimal:2',
  ];

  // to show "components" in json
  protected $appends = ['components'];

  public function user(): BelongsTo
  {
    return $this->belongsTo(User::class);
  }

  public function cpu(): BelongsTo
  {
    return $this->belongsTo(Cpu::class);
  }

  public function motherboard(): BelongsTo
  {
    return $this->belongsTo(Motherboard::class);
  }

  public function ram(): BelongsTo
  {
    return $this->belongsTo(Ram::class);
  }

  public function gpu(): BelongsTo
  {
    return $this->belongsTo(Gpu::class);
  }

  public function ssd(): BelongsTo
  {
    return $this->belongsTo(Ssd::class);
  }

  public function hdd(): BelongsTo
  {
    return $this->belongsTo(Hdd::class);
  }

  public function pcCase(): BelongsTo
  {
    return $this->belongsTo(PcCase::class, 'case_id');
  }

  public function cooler(): BelongsTo
  {
    return $this->belongsTo(Cooler::class);
  }

  public function psu(): BelongsTo
  {
    return $this->belongsTo(Psu::class);
  }

  public function fan(): BelongsTo
  {
    return $this->belongsTo(Fan::class);
  }

  public static function componentSlots(): array
  {
    return [
      'cpu' => 'cpu_id',
      'motherboard' => 'motherboard_id',
      'ram' => 'ram_id',
      'gpu' => 'gpu_id',
      'ssd' => 'ssd_id',
      'hdd' => 'hdd_id',
      'case' => 'case_id',
      'cooler' => 'cooler_id',
      'psu' => 'psu_id',
      'fan' => 'fan_id',
    ];
  }

  public function loadComponents(): self
  {
    $this->load([
      'cpu',
      'motherboard',
      'ram',
      'gpu',
      'ssd',
      'hdd',
      'pcCase',
      'cooler',
      'psu',
      'fan',
    ]);

    return $this;
  }

  // eager load components (when need to return arrays)
  public function getComponentsAttribute(): array
  {
    return [
      'cpu' => $this->cpu,
      'motherboard' => $this->motherboard,
      'ram' => $this->ram,
      'gpu' => $this->gpu,
      'ssd' => $this->ssd,
      'hdd' => $this->hdd,
      'case' => $this->pcCase,
      'cooler' => $this->cooler,
      'psu' => $this->psu,
      'fan' => $this->fan,
    ];
  }

  public function scopeWithComponents($query)
  {
    return $query->with([
      'cpu',
      'motherboard',
      'ram',
      'gpu',
      'ssd',
      'hdd',
      'pcCase',
      'cooler',
      'psu',
      'fan',
    ]);
  }

  public function likes(): HasMany
  {
    return $this->hasMany(BuildLike::class);
  }

  public function bookmarks(): HasMany
  {
    return $this->hasMany(BuildBookmark::class);
  }

  public function reviews(): HasMany
  {
    return $this->hasMany(BuildReview::class);
  }
}
