<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
  public function up(): void
  {
    // voltage was stored as a raw string (e.g. "1.2 V"); every other
    // numeric spec column stores just the number so it can be filtered/
    // sorted, so switch this one to match (doctrine/dbal isn't installed,
    // so drop + re-add instead of ->change())
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
