<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
  public function up(): void
  {
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
