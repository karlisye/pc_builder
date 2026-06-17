<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
  public function up(): void
  {
    Schema::create('build_reviews', function (Blueprint $table) {
      $table->id();
      $table->foreignId('user_id')->constrained()->cascadeOnDelete();
      $table->foreignId('build_id')->constrained()->cascadeOnDelete();
      $table->tinyInteger('rating')->unsigned()->index();
      $table->unique(['user_id', 'build_id']);
      $table->timestamps();
    });
  }
  public function down(): void
  {
    Schema::dropIfExists('build_reviews');
  }
};
