<?php
// database/migrations/2024_01_01_000008_create_cases_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cases', function (Blueprint $table) {
            $table->id();
            $table->string('category', 50)->nullable();
            $table->string('name');
            $table->decimal('price', 10, 2)->nullable();
            $table->text('availability')->nullable();
            $table->string('form_factor', 50)->nullable()->index();
            $table->string('case_type', 100)->nullable();
            $table->string('color', 50)->nullable();
            $table->string('psu_included', 50)->nullable();
            $table->timestamp('scraped_at')->useCurrent();
            
            $table->index('category');
            $table->index('price');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cases');
    }
};
