<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('rams', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('dateks_id')->unique()->index();
            $table->string('url');
            $table->string('name');
            $table->decimal('price', 10, 2)->nullable()->index();
            $table->boolean('in_stock')->default(false)->index();
            $table->string('stock_quantity')->nullable();
            $table->string('memory_type')->nullable()->index();
            $table->smallInteger('capacity')->nullable()->index();
            $table->smallInteger('frequency')->nullable()->index();
            $table->tinyInteger('cl_latency')->nullable();
            $table->tinyInteger('modules_count')->default(1)->index();
            $table->timestamp('scraped_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rams');
    }
};
