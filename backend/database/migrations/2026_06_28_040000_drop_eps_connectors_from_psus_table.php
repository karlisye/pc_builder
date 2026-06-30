<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
  public function up(): void
  {
    // eps_connectors duplicated cpu_connectors (same source value, just an
    // int count instead of the raw string) and was never read anywhere in
    // ComponentQueryFilter/ComponentScorer/BuilderSlotPicker.
    Schema::table('psus', function (Blueprint $table) {
      $table->dropColumn('eps_connectors');
    });
  }

  public function down(): void
  {
    Schema::table('psus', function (Blueprint $table) {
      $table->tinyInteger('eps_connectors')->nullable()->index();
    });
  }
};
