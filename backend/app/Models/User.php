<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
  use HasFactory, Notifiable;

  protected $fillable = [
    'name',
    'email',
    'password',
    'description',
    'role'
  ];

  protected $hidden = [
    'password',
    'remember_token',
  ];

  protected function casts(): array
  {
    return [
      'password' => 'hashed',
    ];
  }

  public function builds(): HasMany
  {
    return $this->hasMany(Build::class);
  }

  public function totalLikes(): int
  {
    return BuildLike::whereHas('build', fn($q) => $q->where('user_id', $this->id)->where('is_public', true))->count();
  }

  public function averageRating(): float
  {
    return BuildReview::whereHas('build', fn($q) => $q->where('user_id', $this->id)->where('is_public', true))
      ->avg('rating') ?? 0;
  }

  public function hasRole(string $role): bool
  {
    return $this->role === $role;
  }
}
