<?php

namespace App\Services;

use Illuminate\Database\Eloquent\Builder;

class BuildQueryFilter
{
  public static function apply(Builder $query, array $filters): Builder
  {
    $query = self::applyGlobal($query, $filters);
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

    return $query;
  }
}
