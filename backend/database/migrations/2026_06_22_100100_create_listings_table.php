<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
  public function up(): void
  {
    Schema::create('listings', function (Blueprint $table) {
      $table->id();
      $table->string('component_type')->index();
      $table->string('product_code')->index();
      $table->string('source')->index();
      $table->string('url');
      $table->decimal('price', 10, 2)->nullable()->index();
      $table->enum('stock_status', ['in_stock', 'orderable', 'out_of_stock'])->default('out_of_stock')->index();
      $table->string('stock_quantity')->nullable();
      $table->timestamp('scraped_at')->nullable()->index();

      $table->unique(['component_type', 'product_code', 'source']);
      $table->index(['component_type', 'product_code']);
      $table->index(['component_type', 'price']);
      $table->index(['component_type', 'stock_status']);
    });
  }

  public function down(): void
  {
    Schema::dropIfExists('listings');
  }
};
