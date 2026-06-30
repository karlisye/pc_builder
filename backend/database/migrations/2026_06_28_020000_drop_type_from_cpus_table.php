<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
  public function up(): void
  {
    // type ("intel"/"amd") duplicated brand; brand now comes from the
    // scraper's JSON-LD extraction, so this column is redundant.
    // NOTE: ComponentQueryFilter::apply() still has a generic `type` filter
    // (backend/app/Services/ComponentQueryFilter.php:188-189) applied across
    // all component tables, and AdminController has example CPU/GPU `type`
    // preference payloads — both need follow-up so CPU filtering uses `brand`
    // instead once this column is gone.
    Schema::table('cpus', function (Blueprint $table) {
      $table->dropColumn('type');
    });
  }

  public function down(): void
  {
    Schema::table('cpus', function (Blueprint $table) {
      $table->string('type')->default('other')->index();
    });
  }
};
