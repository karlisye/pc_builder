<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('fans', function (Blueprint $table) {
            $table->id();
            $table->string('category', 50)->nullable();
            $table->string('name');
            $table->string('url')->nullable();
            $table->decimal('price', 10, 2)->nullable();
            $table->text('availability')->nullable();
            $table->string('manufacturer', 100)->nullable();
            $table->integer('rpm_max')->nullable();
            $table->integer('rpm_min')->nullable();
            $table->integer('size')->nullable()->index();
            $table->string('led_color', 50)->nullable();
            $table->string('connector', 50)->nullable();
            $table->integer('quantity')->nullable();
            $table->string('noise_level', 50)->nullable();
            $table->timestamp('scraped_at')->useCurrent();
            
            $table->index('category');
            $table->index('price');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('fans');
    }
};
