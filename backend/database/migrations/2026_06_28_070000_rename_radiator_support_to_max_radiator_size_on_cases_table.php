<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
  public function up(): void
  {
    // rename to match the max_* naming convention used by max_gpu_length,
    // max_cpu_cooler_height, max_psu_length (doctrine/dbal isn't installed,
    // so drop + re-add instead of ->renameColumn())
    Schema::table('cases', function (Blueprint $table) {
      $table->dropColumn('radiator_support');
    });
    Schema::table('cases', function (Blueprint $table) {
      $table->smallInteger('max_radiator_size')->nullable();
    });
  }

  public function down(): void
  {
    Schema::table('cases', function (Blueprint $table) {
      $table->dropColumn('max_radiator_size');
    });
    Schema::table('cases', function (Blueprint $table) {
      $table->smallInteger('radiator_support')->nullable();
    });
  }
};
