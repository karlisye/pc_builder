<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('hdds_25', function (Blueprint $table) {
            $table->id();
            $table->string('category', 50)->nullable();
            $table->string('name');
            $table->string('url')->nullable();
            $table->decimal('price', 10, 2)->nullable();
            $table->text('availability')->nullable();
            $table->integer('capacity')->nullable()->index();
            $table->string('interface', 100)->nullable();
            $table->integer('rpm')->nullable()->index();
            $table->integer('cache')->nullable();
            $table->timestamp('scraped_at')->useCurrent();
            
            $table->index('category');
            $table->index('price');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('hdds_25');
    }
};
