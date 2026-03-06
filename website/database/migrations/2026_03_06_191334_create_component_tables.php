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
            $table->string('socket')->nullable()->index();           // normalised: "AM4", "LGA1700", "LGA1851"
            $table->smallInteger('cores')->nullable()->index();      // smallInt: covers Threadripper (64c)
            $table->smallInteger('threads')->nullable();             // smallInt: covers Threadripper (128t)
            $table->decimal('clock_rate', 4, 2)->nullable();
            $table->decimal('turbo_frequency', 4, 2)->nullable();
            $table->smallInteger('tdp')->nullable()->index();        // cooler TDP support check
            $table->boolean('integrated_graphics')->nullable()->index(); // true if iGPU name or "Yes"
            $table->boolean('cooler_included')->nullable()->index(); // false = must add cooler to build
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
            $table->string('socket')->nullable()->index();           // normalised: "LGA1851", "AM4"
            $table->string('chipset')->nullable()->index();          // vendor stripped: "Z890", "A520"
            $table->string('form_factor')->nullable()->index();      // "ATX", "mATX" — mobo↔case match
            $table->string('memory_type')->nullable()->index();      // "DDR5", "DDR4" — mobo↔RAM match
            $table->tinyInteger('memory_slots')->nullable()->index(); // RAM modules_count must be ≤ this
            $table->smallInteger('memory_max_speed')->nullable()->index(); // RAM frequency must be ≤ this
            $table->tinyInteger('m2_slots')->nullable()->index();    // NVMe SSD slot availability
            $table->tinyInteger('sata_ports')->nullable()->index();  // SATA SSD/HDD port availability
            $table->boolean('wifi')->nullable()->index();
            $table->timestamp('scraped_at')->nullable();
        });

        Schema::create('ram', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('dateks_id')->unique()->index();
            $table->string('url');
            $table->string('name');
            $table->decimal('price', 10, 2)->nullable()->index();
            $table->boolean('in_stock')->default(false)->index();
            $table->string('stock_quantity')->nullable();
            $table->string('memory_type')->nullable()->index();      // "DDR5", "DDR4"
            $table->smallInteger('capacity')->nullable()->index();   // GB
            $table->smallInteger('frequency')->nullable()->index();  // MHz — must be ≤ mobo memory_max_speed
            $table->tinyInteger('cl_latency')->nullable();
            $table->tinyInteger('modules_count')->nullable()->index(); // must be ≤ mobo memory_slots
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
            $table->string('gpu_model')->nullable()->index();        // "Radeon RX 9070 XT"
            $table->tinyInteger('vram')->nullable()->index();        // GB
            $table->smallInteger('tdp')->nullable()->index();        // contributes to total system TDP
            $table->smallInteger('min_psu')->nullable()->index();    // PSU wattage must be ≥ this
            $table->decimal('pcie_version', 2, 1)->nullable()->index();
            $table->smallInteger('length_mm')->nullable()->index();  // must be ≤ case max_gpu_length
            $table->string('power_connectors')->nullable();          // "1x 16-pin", "2x 8-pin" raw string
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
            $table->smallInteger('capacity')->nullable()->index();   // GB
            $table->string('type')->nullable()->index();             // "NVMe", "SATA"
            $table->string('form_factor')->nullable()->index();      // "M.2", "2.5"
            $table->string('interface')->nullable()->index();        // "PCIe 4.0 x4", "SATA III"
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
            $table->smallInteger('capacity')->nullable()->index();   // GB (2TB → 2000)
            $table->string('form_factor')->nullable()->index();      // null — not in #params
            $table->string('interface')->nullable()->index();        // "SATA III"
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
            $table->string('form_factor')->nullable()->index();      // "Extended ATX", "ATX", "mATX"
            $table->smallInteger('max_gpu_length')->nullable()->index();       // gpu length_mm must be ≤
            $table->smallInteger('max_cpu_cooler_height')->nullable()->index(); // cooler height_mm must be ≤
            $table->tinyInteger('bays_25')->nullable();
            $table->tinyInteger('bays_35')->nullable();
            $table->boolean('psu_included')->nullable()->index();    // true = skip PSU selection
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
            $table->string('connector')->nullable()->index();        // "4-pin (PWM)", "3-pin"
            $table->smallInteger('rpm_max')->nullable();
            $table->smallInteger('rpm_min')->nullable();
            $table->decimal('noise_db', 4, 1)->nullable();
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
            $table->smallInteger('wattage')->nullable()->index();    // must cover total system TDP
            $table->string('efficiency_rating')->nullable()->index(); // "80 PLUS Platinum"
            $table->string('psu_type')->nullable()->index();         // "ATX", "SFX"
            $table->boolean('modular')->nullable()->index();
            $table->smallInteger('fan_size_mm')->nullable();
            $table->tinyInteger('pcie_connectors')->nullable()->index(); // legacy 6+2pin count
            $table->tinyInteger('eps_connectors')->nullable()->index();  // CPU EPS 8-pin count
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
            $table->string('compatibility')->nullable()->index();    // "AM4,AM5,LGA1700,LGA1851,..."
            $table->smallInteger('tdp_support')->nullable()->index(); // must be ≥ cpu.tdp
            $table->smallInteger('height_mm')->nullable()->index();  // must be ≤ case.max_cpu_cooler_height
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
        Schema::dropIfExists('ram');
        Schema::dropIfExists('motherboards');
        Schema::dropIfExists('cpus');
    }
};
