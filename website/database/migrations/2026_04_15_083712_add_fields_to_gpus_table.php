<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
  /**
   * Run the migrations.
   */
  public function up(): void
  {
    Schema::table('gpus', function (Blueprint $table) {
      $table->smallInteger('cuda')->nullable()->index();
      $table->smallInteger('bus')->nullable()->index();
      $table->smallInteger('vram_freq')->nullable()->index();
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::table('gpus', function (Blueprint $table) {
      $table->dropColumn('cuda');
      $table->dropColumn('bus');
      $table->dropColumn('vram_freq');
    });
  }
};
