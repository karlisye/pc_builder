<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('motherboards', function (Blueprint $table) {
            $table->id();
            $table->string('category', 50)->nullable();
            $table->string('name');
            $table->string('url')->nullable();
            $table->decimal('price', 10, 2)->nullable();
            $table->text('availability')->nullable();
            $table->string('series', 100)->nullable();
            $table->string('socket', 100)->nullable()->index();
            $table->string('chipset', 100)->nullable()->index();
            $table->string('form_factor', 50)->nullable();
            $table->string('memory_type', 50)->nullable();
            $table->integer('memory_slots')->nullable();
            $table->string('wifi', 20)->nullable();
            $table->timestamp('scraped_at')->useCurrent();
            
            $table->index('category');
            $table->index('price');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('motherboards');
    }
};
