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
    Schema::create('scrape_results', function (Blueprint $table) {
      $table->id();
      $table->foreignId('session_id')->constrained('scrape_sessions')->cascadeOnDelete();
      $table->string('category');
      $table->unsignedInteger('total');
      $table->unsignedInteger('inserted');
      $table->unsignedInteger('skipped');
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::dropIfExists('scrape_results');
  }
};
