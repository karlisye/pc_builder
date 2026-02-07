<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('coolers', function (Blueprint $table) {
            $table->id();
            $table->string('category', 50)->nullable();
            $table->string('name');
            $table->string('url')->nullable();
            $table->decimal('price', 10, 2)->nullable();
            $table->text('availability')->nullable();
            $table->string('manufacturer', 100)->nullable();
            $table->integer('height')->nullable();
            $table->integer('tdp')->nullable()->index();
            $table->string('cooler_class', 50)->nullable();
            $table->string('led_color', 50)->nullable();
            $table->integer('fan_count')->nullable();
            $table->timestamp('scraped_at')->useCurrent();
            
            $table->index('category');
            $table->index('price');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('coolers');
    }
};
