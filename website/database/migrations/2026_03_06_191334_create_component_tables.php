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
      $table->unsignedInteger('dateks_id')->unique()->index();
      $table->string('url');
      $table->string('name');
      $table->decimal('price', 10, 2)->nullable()->index();
      $table->boolean('in_stock')->default(false)->index();
      $table->string('stock_quantity')->nullable();
      $table->string('socket')->nullable()->index();
      $table->smallInteger('cores')->nullable()->index();
      $table->smallInteger('threads')->nullable();
      $table->decimal('clock_rate', 4, 2)->nullable();
      $table->decimal('turbo_frequency', 4, 2)->nullable();
      $table->smallInteger('tdp')->nullable()->index();
      $table->boolean('integrated_graphics')->default(false)->index();
      $table->boolean('cooler_included')->default(false)->index();
      $table->integer('passmark')->nullable()->index();
      $table->timestamp('scraped_at')->nullable();
    });

    Schema::create('motherboards', function (Blueprint $table) {
      $table->id();
      $table->unsignedInteger('dateks_id')->unique()->index();
      $table->string('url');
      $table->string('name');
      $table->decimal('price', 10, 2)->nullable()->index();
      $table->boolean('in_stock')->default(false)->index();
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
      $table->timestamp('scraped_at')->nullable();
    });

    Schema::create('gpus', function (Blueprint $table) {
      $table->id();
      $table->unsignedInteger('dateks_id')->unique()->index();
      $table->string('url');
      $table->string('name');
      $table->decimal('price', 10, 2)->nullable()->index();
      $table->boolean('in_stock')->default(false)->index();
      $table->string('stock_quantity')->nullable();
      $table->string('gpu_model')->nullable()->index();
      $table->tinyInteger('vram')->nullable()->index();
      $table->smallInteger('tdp')->nullable()->index();
      $table->smallInteger('min_psu')->nullable()->index();
      $table->decimal('pcie_version', 2, 1)->nullable()->index();
      $table->smallInteger('length_mm')->nullable()->index();
      $table->string('power_connectors')->nullable();
      $table->timestamp('scraped_at')->nullable();
    });

    Schema::create('ssds', function (Blueprint $table) {
      $table->id();
      $table->unsignedInteger('dateks_id')->unique()->index();
      $table->string('url');
      $table->string('name');
      $table->decimal('price', 10, 2)->nullable()->index();
      $table->boolean('in_stock')->default(false)->index();
      $table->string('stock_quantity')->nullable();
      $table->smallInteger('capacity')->nullable()->index();
      $table->string('type')->nullable()->index();
      $table->string('form_factor')->nullable()->index();
      $table->string('interface')->nullable()->index();
      $table->smallInteger('read_speed')->nullable();
      $table->smallInteger('write_speed')->nullable();
      $table->timestamp('scraped_at')->nullable();
    });

    Schema::create('hdds', function (Blueprint $table) {
      $table->id();
      $table->unsignedInteger('dateks_id')->unique()->index();
      $table->string('url');
      $table->string('name');
      $table->decimal('price', 10, 2)->nullable()->index();
      $table->boolean('in_stock')->default(false)->index();
      $table->string('stock_quantity')->nullable();
      $table->smallInteger('capacity')->nullable()->index();
      $table->string('interface')->nullable()->index();
      $table->timestamp('scraped_at')->nullable();
    });

    Schema::create('cases', function (Blueprint $table) {
      $table->id();
      $table->unsignedInteger('dateks_id')->unique()->index();
      $table->string('url');
      $table->string('name');
      $table->decimal('price', 10, 2)->nullable()->index();
      $table->boolean('in_stock')->default(false)->index();
      $table->string('stock_quantity')->nullable();
      $table->string('form_factor')->nullable()->index();
      $table->smallInteger('max_gpu_length')->nullable()->index();
      $table->smallInteger('max_cpu_cooler_height')->nullable()->index();
      $table->tinyInteger('bays_25')->nullable();
      $table->tinyInteger('bays_35')->nullable();
      $table->smallInteger('psu_wattage')->nullable()->index();
      $table->timestamp('scraped_at')->nullable();
    });

    Schema::create('fans', function (Blueprint $table) {
      $table->id();
      $table->unsignedInteger('dateks_id')->unique()->index();
      $table->string('url');
      $table->string('name');
      $table->decimal('price', 10, 2)->nullable()->index();
      $table->boolean('in_stock')->default(false)->index();
      $table->string('stock_quantity')->nullable();
      $table->smallInteger('size_mm')->nullable()->index();
      $table->string('connector')->nullable()->index();
      $table->smallInteger('rpm_max')->nullable();
      $table->tinyInteger('units_in_package')->nullable();
      $table->timestamp('scraped_at')->nullable();
    });

    Schema::create('psus', function (Blueprint $table) {
      $table->id();
      $table->unsignedInteger('dateks_id')->unique()->index();
      $table->string('url');
      $table->string('name');
      $table->decimal('price', 10, 2)->nullable()->index();
      $table->boolean('in_stock')->default(false)->index();
      $table->string('stock_quantity')->nullable();
      $table->smallInteger('wattage')->nullable()->index();
      $table->string('efficiency_rating')->nullable()->index();
      $table->string('psu_type')->nullable()->index();
      $table->boolean('modular')->default(false)->index();
      $table->smallInteger('fan_size_mm')->nullable();
      $table->tinyInteger('pcie_connectors')->nullable()->index();
      $table->tinyInteger('eps_connectors')->nullable()->index();
      $table->tinyInteger('sata_connectors')->nullable()->index();
      $table->timestamp('scraped_at')->nullable();
    });

    Schema::create('coolers', function (Blueprint $table) {
      $table->id();
      $table->unsignedInteger('dateks_id')->unique()->index();
      $table->string('url');
      $table->string('name');
      $table->decimal('price', 10, 2)->nullable()->index();
      $table->boolean('in_stock')->default(false)->index();
      $table->string('stock_quantity')->nullable();
      $table->string('compatibility')->nullable()->index();
      $table->smallInteger('tdp_support')->nullable()->index();
      $table->smallInteger('height_mm')->nullable()->index();
      $table->smallInteger('fan_size_mm')->nullable();
      $table->timestamp('scraped_at')->nullable();
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
  }
};
