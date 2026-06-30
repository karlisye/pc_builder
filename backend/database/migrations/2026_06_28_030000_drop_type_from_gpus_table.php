<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
  public function up(): void
  {
    // type ("amd"/"nvidia"/"intel") duplicated gpu_family, which now uses the
    // same name-based detection logic type used to use.
    // NOTE: BuilderSlotPicker::pick() still has `->where('type', $preferences['gpu'])`
    // (backend/app/Services/BuilderSlotPicker.php, marked with TODOs) -- needs to
    // switch to `gpu_family` once this column is gone.
    Schema::table('gpus', function (Blueprint $table) {
      $table->dropColumn('type');
    });
  }

  public function down(): void
  {
    Schema::table('gpus', function (Blueprint $table) {
      $table->string('type')->default('other')->index();
    });
  }
};
