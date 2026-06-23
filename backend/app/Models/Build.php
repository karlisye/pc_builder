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
    'cpu_product_code',
    'motherboard_product_code',
    'ram_product_code',
    'gpu_product_code',
    'ssd_product_code',
    'hdd_product_code',
    'case_product_code',
    'cooler_product_code',
    'psu_product_code',
    'fan_product_code',
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
    return $this->belongsTo(Cpu::class, 'cpu_product_code', 'product_code');
  }

  public function motherboard(): BelongsTo
  {
    return $this->belongsTo(Motherboard::class, 'motherboard_product_code', 'product_code');
  }

  public function ram(): BelongsTo
  {
    return $this->belongsTo(Ram::class, 'ram_product_code', 'product_code');
  }

  public function gpu(): BelongsTo
  {
    return $this->belongsTo(Gpu::class, 'gpu_product_code', 'product_code');
  }

  public function ssd(): BelongsTo
  {
    return $this->belongsTo(Ssd::class, 'ssd_product_code', 'product_code');
  }

  public function hdd(): BelongsTo
  {
    return $this->belongsTo(Hdd::class, 'hdd_product_code', 'product_code');
  }

  public function pcCase(): BelongsTo
  {
    return $this->belongsTo(PcCase::class, 'case_product_code', 'product_code');
  }

  public function cooler(): BelongsTo
  {
    return $this->belongsTo(Cooler::class, 'cooler_product_code', 'product_code');
  }

  public function psu(): BelongsTo
  {
    return $this->belongsTo(Psu::class, 'psu_product_code', 'product_code');
  }

  public function fan(): BelongsTo
  {
    return $this->belongsTo(Fan::class, 'fan_product_code', 'product_code');
  }

  public static function componentSlots(): array
  {
    return [
      'cpu'         => 'cpu_product_code',
      'motherboard' => 'motherboard_product_code',
      'ram'         => 'ram_product_code',
      'gpu'         => 'gpu_product_code',
      'ssd'         => 'ssd_product_code',
      'hdd'         => 'hdd_product_code',
      'case'        => 'case_product_code',
      'cooler'      => 'cooler_product_code',
      'psu'         => 'psu_product_code',
      'fan'         => 'fan_product_code',
    ];
  }

  public function loadComponents(): self
  {
    $withListings = fn($q) => $q->with(['listings' => fn($q2) => $q2->orderBy('price')]);

    $this->load([
      'cpu' => $withListings,
      'motherboard' => $withListings,
      'ram' => $withListings,
      'gpu' => $withListings,
      'ssd' => $withListings,
      'hdd' => $withListings,
      'pcCase' => $withListings,
      'cooler' => $withListings,
      'psu' => $withListings,
      'fan' => $withListings,
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
