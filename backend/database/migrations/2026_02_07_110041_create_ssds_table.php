<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ssds', function (Blueprint $table) {
            $table->id();
            $table->string('category', 50)->nullable();
            $table->string('name');
            $table->decimal('price', 10, 2)->nullable();
            $table->text('availability')->nullable();
            $table->integer('capacity')->nullable()->index();
            $table->string('type', 50)->nullable()->index();
            $table->integer('read_speed')->nullable();
            $table->integer('write_speed')->nullable();
            $table->string('form_factor', 50)->nullable();
            $table->string('interface', 100)->nullable();
            $table->timestamp('scraped_at')->useCurrent();
            
            $table->index('category');
            $table->index('price');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ssds');
    }
};
