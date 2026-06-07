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
    'type',
    'total_price',
    'cpu_dateks_id',
    'motherboard_dateks_id',
    'ram_dateks_id',
    'gpu_dateks_id',
    'ssd_dateks_id',
    'hdd_dateks_id',
    'case_dateks_id',
    'cooler_dateks_id',
    'psu_dateks_id',
    'fan_dateks_id',
    'is_public'
  ];

  protected $casts = [
    'total_price' => 'decimal:2',
  ];

  // to show "components" in json
  protected $appends = ['components', 'selected_components_count'];

  public function user(): BelongsTo
  {
    return $this->belongsTo(User::class);
  }

  public function cpu(): BelongsTo
  {
    return $this->belongsTo(Cpu::class, 'cpu_dateks_id', 'dateks_id');
  }

  public function motherboard(): BelongsTo
  {
    return $this->belongsTo(Motherboard::class, 'motherboard_dateks_id', 'dateks_id');
  }

  public function ram(): BelongsTo
  {
    return $this->belongsTo(Ram::class, 'ram_dateks_id', 'dateks_id');
  }

  public function gpu(): BelongsTo
  {
    return $this->belongsTo(Gpu::class, 'gpu_dateks_id', 'dateks_id');
  }

  public function ssd(): BelongsTo
  {
    return $this->belongsTo(Ssd::class, 'ssd_dateks_id', 'dateks_id');
  }

  public function hdd(): BelongsTo
  {
    return $this->belongsTo(Hdd::class, 'hdd_dateks_id', 'dateks_id');
  }

  public function pcCase(): BelongsTo
  {
    return $this->belongsTo(PcCase::class, 'case_dateks_id', 'dateks_id');
  }

  public function cooler(): BelongsTo
  {
    return $this->belongsTo(Cooler::class, 'cooler_dateks_id', 'dateks_id');
  }

  public function psu(): BelongsTo
  {
    return $this->belongsTo(Psu::class, 'psu_dateks_id', 'dateks_id');
  }

  public function fan(): BelongsTo
  {
    return $this->belongsTo(Fan::class, 'fan_dateks_id', 'dateks_id');
  }

  public static function componentSlots(): array
  {
    return [
      'cpu'         => 'cpu_dateks_id',
      'motherboard' => 'motherboard_dateks_id',
      'ram'         => 'ram_dateks_id',
      'gpu'         => 'gpu_dateks_id',
      'ssd'         => 'ssd_dateks_id',
      'hdd'         => 'hdd_dateks_id',
      'case'        => 'case_dateks_id',
      'cooler'      => 'cooler_dateks_id',
      'psu'         => 'psu_dateks_id',
      'fan'         => 'fan_dateks_id',
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

  public function getSelectedComponentsCountAttribute(): int
  {
    return collect(self::componentSlots())
      ->filter(fn($idColumn) => !is_null($this->$idColumn))
      ->count();
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

  public static function totalComponentCount(): int
  {
    return Cpu::count()
      + Motherboard::count()
      + Ram::count()
      + Gpu::count()
      + Ssd::count()
      + Hdd::count()
      + PcCase::count()
      + Cooler::count()
      + Psu::count()
      + Fan::count();
  }
}
