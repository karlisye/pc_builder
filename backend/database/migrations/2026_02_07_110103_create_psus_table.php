<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('psus', function (Blueprint $table) {
            $table->id();
            $table->string('category', 50)->nullable();
            $table->string('name');
            $table->decimal('price', 10, 2)->nullable();
            $table->text('availability')->nullable();
            $table->string('manufacturer', 100)->nullable();
            $table->integer('wattage')->nullable()->index();
            $table->string('certification', 50)->nullable()->index();
            $table->integer('fan_size')->nullable();
            $table->string('modular', 50)->nullable();
            $table->string('cpu_connector', 100)->nullable();
            $table->string('pcie_connector', 100)->nullable();
            $table->timestamp('scraped_at')->useCurrent();
            
            $table->index('category');
            $table->index('price');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('psus');
    }
};
