<?php

namespace App\Services\ComponentSelectors;

use App\Models\Gpu;

class GpuSelector
{
  public function select($budget)
  {
    return Gpu::whereNotNull('memory')
      ->whereNotNull('price')
      ->where('price', '<=', $budget)
      ->where('gpu_model', 'NOT LIKE', '%Pro%')
      ->where('gpu_model', 'NOT LIKE', '%Arc%')
      ->where('gpu_model', 'NOT LIKE', '%Quadro%')
      ->where('gpu_model', 'NOT LIKE', '%RTX A%')
      ->where('gpu_model', 'NOT LIKE', '%T1000%')
      ->where('gpu_model', 'NOT LIKE', '%T400%')
      ->orderByDesc('memory')
      ->orderByDesc('gpu_speed')
      ->first();
  }
}
