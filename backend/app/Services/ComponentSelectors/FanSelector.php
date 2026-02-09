<?php

namespace App\Services\ComponentSelectors;

use App\Models\Fan;

class FanSelector
{
  public function select($budget)
  {
    $fans = $this->selectMultiFanKit($budget);
    if ($fans) return $fans;

    return $this->selectSingleFan($budget);
  }

  protected function selectMultiFanKit($budget)
  {
    return Fan::whereNotNull('price')
      ->where('price', '<=', $budget)
      ->whereNotNull('quantity')
      ->whereNotNull('size')
      ->where('quantity', '>=', 2)
      ->whereIn('size', [120, 140])
      ->orderByDesc('quantity')
      ->orderBy('price', 'asc')
      ->first();
  }

  protected function selectSingleFan($budget)
  {
    return Fan::whereNotNull('price')
      ->where('price', '<=', $budget)
      ->whereNotNull('size')
      ->whereIn('size', [120, 140])
      ->orderBy('price', 'asc')
      ->first();
  }
}
