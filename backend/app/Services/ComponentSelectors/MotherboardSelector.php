<?php

namespace App\Services\ComponentSelectors;

use App\Models\Motherboard;

class MotherboardSelector
{
  public function select($budget, $cpu)
  {
    return Motherboard::where('socket', $cpu->socket)
      ->whereNotNull('memory_type')
      ->whereNotNull('price')
      ->where('price', '<=', $budget)
      ->orderByDesc('memory_slots')
      ->first();
  }
}
