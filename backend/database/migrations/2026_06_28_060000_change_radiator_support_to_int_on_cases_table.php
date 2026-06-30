<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
  public function up(): void
  {
    // radiator_support used to be a comma-separated list of front fan
    // diameters (an indirect proxy for radiator size); switched to scrape
    // the literal "Maks. radiatora izmērs, mm" #params field instead, which
    // is a single mm measurement, so the column changes from string to int
    // (doctrine/dbal isn't installed, so drop + re-add instead of ->change())
    Schema::table('cases', function (Blueprint $table) {
      $table->dropColumn('radiator_support');
    });
    Schema::table('cases', function (Blueprint $table) {
      $table->smallInteger('radiator_support')->nullable();
    });
  }

  public function down(): void
  {
    Schema::table('cases', function (Blueprint $table) {
      $table->dropColumn('radiator_support');
    });
    Schema::table('cases', function (Blueprint $table) {
      $table->string('radiator_support')->nullable();
    });
  }
};
