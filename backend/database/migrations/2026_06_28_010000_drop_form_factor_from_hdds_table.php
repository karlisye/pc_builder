<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
  public function up(): void
  {
    // all scraped categories are 3.5" drives, so this field carries no information
    Schema::table('hdds', function (Blueprint $table) {
      $table->dropColumn('form_factor');
    });
  }

  public function down(): void
  {
    Schema::table('hdds', function (Blueprint $table) {
      $table->string('form_factor')->nullable()->index();
    });
  }
};
