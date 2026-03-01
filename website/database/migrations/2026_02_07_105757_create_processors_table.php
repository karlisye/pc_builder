<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('processors', function (Blueprint $table) {
            $table->id();
            $table->string('category', 50)->nullable();
            $table->string('name');
            $table->string('url')->nullable();
            $table->decimal('price', 10, 2)->nullable();
            $table->text('availability')->nullable();
            $table->string('socket', 100)->nullable()->index();
            $table->string('processor_number', 100)->nullable();
            $table->integer('cores')->nullable()->index();
            $table->integer('frequency')->nullable()->index();
            $table->integer('cache')->nullable();
            $table->integer('lithography')->nullable();
            $table->integer('tdp')->nullable();
            $table->boolean('cooler_included')->default(false);
            $table->string('integrated_graphics')->nullable();
            $table->timestamp('scraped_at')->useCurrent();

            $table->index('category');
            $table->index('price');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('processors');
    }
};
