<?php

namespace App\Services;

use Illuminate\Database\Eloquent\Builder;

class BuildQueryFilter
{
  public static function apply(Builder $query, array $filters): Builder
  {
    $query = self::applyGlobal($query, $filters);
    $query = self::applySort($query, $filters['sort'] ?? null);
    return $query;
  }

  private static function applyGlobal(Builder $query, array $filters): Builder
  {
    // search by name
    if (! empty($filters['search'])) {
      $query->where('name', 'like', '%' . $filters['search'] . '%')
        ->orWhereHas('user', function ($q) use ($filters) {
          $q->where('name', 'like', '%' . $filters['search'] . '%');
        });
    }

    // price range
    if (isset($filters['min_price']) && is_numeric($filters['min_price'])) {
      $query->where('total_price', '>=', (float) $filters['min_price']);
    }

    if (isset($filters['max_price']) && is_numeric($filters['max_price'])) {
      $query->where('total_price', '<=', (float) $filters['max_price']);
    }

    if (isset($filters['show'])) {
      match ($filters['show']) {
        'liked' => $query->whereHas('likes', fn($q) => $q->where('user_id', auth()->id())),
        'bookmarked' => $query->whereHas('bookmarks', fn($q) => $q->where('user_id', auth()->id())),
        'personal' => $query->where('user_id', auth()->id()),
        default => null,
      };
    }

    if (isset($filters['rating'])) {
      $query->having('reviews_avg_rating', '>=', (int) $filters['rating']);
    }

    if (isset($filters['type'])) {
      $query->where('type', $filters['type']);
    }

    if (isset($filters['gpu_pref'])) {
      $query->whereHas('gpu', fn($q) => $q->where('type', $filters['gpu_pref']));
    }
    if (isset($filters['cpu_pref'])) {
      $query->whereHas('cpu', fn($q) => $q->where('type', $filters['cpu_pref']));
    }

    return $query;
  }

  private static function applySort(Builder $query, ?string $sort): Builder
  {
    return match ($sort) {
      'date_asc' => $query->orderBy('updated_at'),
      'date_desc' => $query->orderByDesc('updated_at'),
      'price_asc' => $query->orderBy('total_price'),
      'price_desc' => $query->orderByDesc('total_price'),
      'likes_asc' => $query->orderBy('likes_count'),
      'likes_desc' => $query->orderByDesc('likes_count'),
      'rating_asc' => $query->orderBy('reviews_avg_rating'),
      'rating_desc' => $query->orderByDesc('reviews_avg_rating'),
      default => $query->orderBy('updated_at')
    };
  }
}
