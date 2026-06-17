<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
  public function up(): void
  {
    Schema::create('cpus', function (Blueprint $table) {
      $table->id();
      $table->unsignedInteger('dateks_id')->unique();
      $table->string('url');
      $table->string('name')->index();
      $table->string('type')->default('other')->index();
      $table->decimal('price', 10, 2)->nullable()->index();
      $table->enum('stock_status', ['in_stock', 'orderable', 'out_of_stock'])->default('out_of_stock')->index();
      $table->string('stock_quantity')->nullable();
      $table->string('socket')->nullable()->index();
      $table->smallInteger('cores')->nullable()->index();
      $table->smallInteger('threads')->nullable()->index();
      $table->decimal('clock_rate', 4, 2)->nullable()->index();
      $table->decimal('turbo_frequency', 4, 2)->nullable()->index();
      $table->smallInteger('tdp')->nullable()->index();
      $table->boolean('integrated_graphics')->default(false)->index();
      $table->boolean('cooler_included')->default(false)->index();
      $table->integer('passmark')->nullable()->index();
      $table->timestamp('scraped_at')->nullable()->index();

      $table->index(['socket', 'price']);
      $table->index(['cores', 'threads', 'price']);
    });

    Schema::create('motherboards', function (Blueprint $table) {
      $table->id();
      $table->unsignedInteger('dateks_id')->unique();
      $table->string('url');
      $table->string('name')->index();
      $table->decimal('price', 10, 2)->nullable()->index();
      $table->enum('stock_status', ['in_stock', 'orderable', 'out_of_stock'])->default('out_of_stock')->index();
      $table->string('stock_quantity')->nullable();
      $table->string('socket')->nullable()->index();
      $table->string('chipset')->nullable()->index();
      $table->string('form_factor')->nullable()->index();
      $table->string('memory_type')->nullable()->index();
      $table->tinyInteger('memory_slots')->nullable()->index();
      $table->smallInteger('memory_max_speed')->nullable()->index();
      $table->tinyInteger('m2_slots')->nullable()->index();
      $table->tinyInteger('sata_ports')->nullable()->index();
      $table->boolean('wifi')->default(false)->index();
      $table->timestamp('scraped_at')->nullable()->index();

      $table->index(['socket', 'chipset', 'form_factor']);
      $table->index(['socket', 'memory_type', 'price']);
    });

    Schema::create('gpus', function (Blueprint $table) {
      $table->id();
      $table->unsignedInteger('dateks_id')->unique();
      $table->string('url');
      $table->string('name')->index();
      $table->string('type')->default('other')->index();
      $table->decimal('price', 10, 2)->nullable()->index();
      $table->enum('stock_status', ['in_stock', 'orderable', 'out_of_stock'])->default('out_of_stock')->index();
      $table->string('stock_quantity')->nullable();
      $table->string('gpu_model')->nullable()->index();
      $table->tinyInteger('vram')->nullable()->index();
      $table->smallInteger('tdp')->nullable()->index();
      $table->smallInteger('cuda')->nullable()->index();
      $table->smallInteger('bus')->nullable()->index();
      $table->smallInteger('vram_freq')->nullable()->index();
      $table->smallInteger('min_psu')->nullable()->index();
      $table->decimal('pcie_version', 2, 1)->nullable()->index();
      $table->smallInteger('length_mm')->nullable()->index();
      $table->string('power_connectors')->nullable()->index();
      $table->timestamp('scraped_at')->nullable()->index();

      $table->index(['gpu_model', 'vram']);
      $table->index(['vram', 'price']);
    });

    Schema::create('ssds', function (Blueprint $table) {
      $table->id();
      $table->unsignedInteger('dateks_id')->unique();
      $table->string('url');
      $table->string('name')->index();
      $table->decimal('price', 10, 2)->nullable()->index();
      $table->enum('stock_status', ['in_stock', 'orderable', 'out_of_stock'])->default('out_of_stock')->index();
      $table->string('stock_quantity')->nullable();
      $table->smallInteger('capacity')->nullable()->index();
      $table->string('type')->nullable()->index();
      $table->string('form_factor')->nullable()->index();
      $table->string('interface')->nullable()->index();
      $table->smallInteger('read_speed')->nullable()->index();
      $table->smallInteger('write_speed')->nullable()->index();
      $table->timestamp('scraped_at')->nullable()->index();

      $table->index(['capacity', 'interface']);
      $table->index(['type', 'form_factor']);
    });

    Schema::create('hdds', function (Blueprint $table) {
      $table->id();
      $table->unsignedInteger('dateks_id')->unique();
      $table->string('url');
      $table->string('name')->index();
      $table->decimal('price', 10, 2)->nullable()->index();
      $table->enum('stock_status', ['in_stock', 'orderable', 'out_of_stock'])->default('out_of_stock')->index();
      $table->string('stock_quantity')->nullable();
      $table->smallInteger('capacity')->nullable()->index();
      $table->string('interface')->nullable()->index();
      $table->timestamp('scraped_at')->nullable()->index();

      $table->index(['capacity', 'price']);
    });

    Schema::create('cases', function (Blueprint $table) {
      $table->id();
      $table->unsignedInteger('dateks_id')->unique();
      $table->string('url');
      $table->string('name')->index();
      $table->decimal('price', 10, 2)->nullable()->index();
      $table->enum('stock_status', ['in_stock', 'orderable', 'out_of_stock'])->default('out_of_stock')->index();
      $table->string('stock_quantity')->nullable();
      $table->string('form_factor')->nullable()->index();
      $table->smallInteger('max_gpu_length')->nullable()->index();
      $table->smallInteger('max_cpu_cooler_height')->nullable()->index();
      $table->tinyInteger('bays_25')->nullable()->index();
      $table->tinyInteger('bays_35')->nullable()->index();
      $table->smallInteger('psu_wattage')->nullable()->index();
      $table->timestamp('scraped_at')->nullable()->index();

      $table->index(['form_factor', 'max_gpu_length']);
    });

    Schema::create('fans', function (Blueprint $table) {
      $table->id();
      $table->unsignedInteger('dateks_id')->unique();
      $table->string('url');
      $table->string('name')->index();
      $table->decimal('price', 10, 2)->nullable()->index();
      $table->enum('stock_status', ['in_stock', 'orderable', 'out_of_stock'])->default('out_of_stock')->index();
      $table->string('stock_quantity')->nullable();
      $table->smallInteger('size_mm')->nullable()->index();
      $table->string('connector')->nullable()->index();
      $table->smallInteger('rpm_max')->nullable()->index();
      $table->tinyInteger('units_in_package')->nullable()->index();
      $table->timestamp('scraped_at')->nullable()->index();

      $table->index(['size_mm', 'connector']);
    });

    Schema::create('psus', function (Blueprint $table) {
      $table->id();
      $table->unsignedInteger('dateks_id')->unique();
      $table->string('url');
      $table->string('name')->index();
      $table->decimal('price', 10, 2)->nullable()->index();
      $table->enum('stock_status', ['in_stock', 'orderable', 'out_of_stock'])->default('out_of_stock')->index();
      $table->string('stock_quantity')->nullable();
      $table->smallInteger('wattage')->nullable()->index();
      $table->string('efficiency_rating')->nullable()->index();
      $table->string('psu_type')->nullable()->index();
      $table->boolean('modular')->default(false)->index();
      $table->smallInteger('fan_size_mm')->nullable()->index();
      $table->tinyInteger('pcie_connectors')->nullable()->index();
      $table->tinyInteger('eps_connectors')->nullable()->index();
      $table->tinyInteger('sata_connectors')->nullable()->index();
      $table->timestamp('scraped_at')->nullable()->index();

      $table->index(['wattage', 'efficiency_rating']);
      $table->index(['psu_type', 'modular']);
    });

    Schema::create('coolers', function (Blueprint $table) {
      $table->id();
      $table->unsignedInteger('dateks_id')->unique();
      $table->string('url');
      $table->string('name')->index();
      $table->decimal('price', 10, 2)->nullable()->index();
      $table->enum('stock_status', ['in_stock', 'orderable', 'out_of_stock'])->default('out_of_stock')->index();
      $table->string('stock_quantity')->nullable();
      $table->string('compatibility')->nullable()->index();
      $table->smallInteger('tdp_support')->nullable()->index();
      $table->smallInteger('height_mm')->nullable()->index();
      $table->smallInteger('fan_size_mm')->nullable()->index();
      $table->timestamp('scraped_at')->nullable()->index();

      $table->index(['compatibility', 'tdp_support']);
      $table->index(['height_mm', 'tdp_support']);
    });

    Schema::create('rams', function (Blueprint $table) {
      $table->id();
      $table->unsignedInteger('dateks_id')->unique();
      $table->string('url');
      $table->string('name')->index();
      $table->decimal('price', 10, 2)->nullable()->index();
      $table->enum('stock_status', ['in_stock', 'orderable', 'out_of_stock'])->default('out_of_stock')->index();
      $table->string('stock_quantity')->nullable();
      $table->string('memory_type')->nullable()->index();
      $table->smallInteger('capacity')->nullable()->index();
      $table->smallInteger('frequency')->nullable()->index();
      $table->tinyInteger('cl_latency')->nullable()->index();
      $table->tinyInteger('modules_count')->default(1)->index();
      $table->timestamp('scraped_at')->nullable()->index();

      $table->index(['memory_type', 'capacity', 'frequency']);
      $table->index(['capacity', 'modules_count']);
    });
  }

  public function down(): void
  {
    Schema::dropIfExists('coolers');
    Schema::dropIfExists('psus');
    Schema::dropIfExists('fans');
    Schema::dropIfExists('cases');
    Schema::dropIfExists('hdds');
    Schema::dropIfExists('ssds');
    Schema::dropIfExists('gpus');
    Schema::dropIfExists('motherboards');
    Schema::dropIfExists('cpus');
    Schema::dropIfExists('rams');
  }
};
