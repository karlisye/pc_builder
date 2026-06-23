<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
  public function up(): void
  {
    Schema::dropIfExists('build_bookmarks');
  }

  public function down(): void
  {
    Schema::create('build_bookmarks', function ($table) {
      $table->id();
      $table->foreignId('user_id')->constrained()->cascadeOnDelete();
      $table->foreignId('build_id')->constrained()->cascadeOnDelete();
      $table->timestamps();
    });
  }
};
