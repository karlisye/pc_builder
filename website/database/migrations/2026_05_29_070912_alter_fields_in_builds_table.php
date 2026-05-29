<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
  public function up(): void
  {
    Schema::table('builds', function (Blueprint $table) {
      $table->dropForeign(['cpu_id']);
      $table->dropForeign(['motherboard_id']);
      $table->dropForeign(['ram_id']);
      $table->dropForeign(['gpu_id']);
      $table->dropForeign(['ssd_id']);
      $table->dropForeign(['hdd_id']);
      $table->dropForeign(['case_id']);
      $table->dropForeign(['cooler_id']);
      $table->dropForeign(['psu_id']);
      $table->dropForeign(['fan_id']);

      $table->dropColumn([
        'cpu_id',
        'motherboard_id',
        'ram_id',
        'gpu_id',
        'ssd_id',
        'hdd_id',
        'case_id',
        'cooler_id',
        'psu_id',
        'fan_id'
      ]);

      $table->unsignedBigInteger('cpu_dateks_id')->nullable();
      $table->unsignedBigInteger('motherboard_dateks_id')->nullable();
      $table->unsignedBigInteger('ram_dateks_id')->nullable();
      $table->unsignedBigInteger('gpu_dateks_id')->nullable();
      $table->unsignedBigInteger('ssd_dateks_id')->nullable();
      $table->unsignedBigInteger('hdd_dateks_id')->nullable();
      $table->unsignedBigInteger('case_dateks_id')->nullable();
      $table->unsignedBigInteger('cooler_dateks_id')->nullable();
      $table->unsignedBigInteger('psu_dateks_id')->nullable();
      $table->unsignedBigInteger('fan_dateks_id')->nullable();
    });
  }

  public function down(): void
  {
    Schema::table('builds', function (Blueprint $table) {
      //
    });
  }
};
