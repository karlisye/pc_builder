<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
  private array $slots = [
    'cpu', 'motherboard', 'ram', 'gpu', 'ssd',
    'hdd', 'case', 'cooler', 'psu', 'fan',
  ];

  public function up(): void
  {
    Schema::table('builds', function (Blueprint $table) {
      $table->dropColumn(array_map(fn ($slot) => "{$slot}_dateks_id", $this->slots));

      foreach ($this->slots as $slot) {
        $table->string("{$slot}_product_code")->nullable();
      }
    });
  }

  public function down(): void
  {
    Schema::table('builds', function (Blueprint $table) {
      $table->dropColumn(array_map(fn ($slot) => "{$slot}_product_code", $this->slots));

      foreach ($this->slots as $slot) {
        $table->unsignedBigInteger("{$slot}_dateks_id")->nullable();
      }
    });
  }
};
