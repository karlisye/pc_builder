<?php

namespace App\Models;

use App\Notifications\VerifyEmailNotification;
use Illuminate\Auth\MustVerifyEmail as MustVerifyEmailTrait;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable implements MustVerifyEmail
{
  use HasFactory, Notifiable, MustVerifyEmailTrait;

  protected $fillable = [
    'name',
    'email',
    'password',
    'description',
    'role',
    'email_verified_at',
  ];

  protected $hidden = [
    'password',
    'remember_token',
  ];

  protected function casts(): array
  {
    return [
      'password' => 'hashed',
      'email_verified_at' => 'datetime',
    ];
  }

  public function builds(): HasMany
  {
    return $this->hasMany(Build::class);
  }

  public function hasRole(string $role): bool
  {
    return $this->role === $role;
  }

  public function sendEmailVerificationNotification(): void
  {
    $this->notify(new VerifyEmailNotification());
  }
}
