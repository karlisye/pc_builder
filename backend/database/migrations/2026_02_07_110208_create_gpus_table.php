<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('gpus', function (Blueprint $table) {
            $table->id();
            $table->string('category', 50)->nullable();
            $table->string('name');
            $table->decimal('price', 10, 2)->nullable();
            $table->text('availability')->nullable();
            $table->string('gpu_model', 100)->nullable()->index();
            $table->integer('gpu_speed')->nullable();
            $table->string('power_connector', 50)->nullable();
            $table->integer('memory')->nullable()->index();
            $table->string('memory_type', 50)->nullable();
            $table->string('cooling', 100)->nullable();
            $table->timestamp('scraped_at')->useCurrent();
            
            $table->index('category');
            $table->index('price');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('gpus');
    }
};
