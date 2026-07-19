<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
  public function up(): void
  {
    Schema::table('rams', function (Blueprint $table) {
      $table->dropColumn('voltage');
    });
    Schema::table('rams', function (Blueprint $table) {
      $table->decimal('voltage', 3, 2)->nullable();
    });
  }

  public function down(): void
  {
    Schema::table('rams', function (Blueprint $table) {
      $table->dropColumn('voltage');
    });
    Schema::table('rams', function (Blueprint $table) {
      $table->string('voltage')->nullable();
    });
  }
};
