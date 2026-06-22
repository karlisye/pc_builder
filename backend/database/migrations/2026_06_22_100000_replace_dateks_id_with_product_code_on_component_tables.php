<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
  private array $tables = [
    'cpus', 'motherboards', 'gpus', 'ssds', 'hdds',
    'cases', 'fans', 'psus', 'coolers', 'rams',
  ];

  // composite indexes that include the soon-to-be-dropped price column
  private array $priceIndexes = [
    'cpus' => [['socket', 'price'], ['cores', 'threads', 'price']],
    'motherboards' => [['socket', 'memory_type', 'price']],
    'gpus' => [['vram', 'price']],
    'hdds' => [['capacity', 'price']],
  ];

  public function up(): void
  {
    // old rows have no product_code and are useless without a rescrape
    foreach ($this->tables as $table) {
      DB::table($table)->truncate();
    }

    foreach ($this->tables as $table) {
      Schema::table($table, function (Blueprint $table_) use ($table) {
        foreach ($this->priceIndexes[$table] ?? [] as $columns) {
          $table_->dropIndex($columns);
        }

        $table_->dropColumn(['dateks_id', 'url', 'price', 'stock_status', 'stock_quantity']);
        $table_->string('product_code')->unique()->after('id');
      });
    }
  }

  public function down(): void
  {
    foreach ($this->tables as $table) {
      Schema::table($table, function (Blueprint $table_) {
        $table_->dropColumn('product_code');
        $table_->unsignedInteger('dateks_id')->unique();
        $table_->string('url');
        $table_->decimal('price', 10, 2)->nullable()->index();
        $table_->enum('stock_status', ['in_stock', 'orderable', 'out_of_stock'])->default('out_of_stock')->index();
        $table_->string('stock_quantity')->nullable();
      });
    }
  }
};
