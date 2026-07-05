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
        Schema::dropIfExists('scrape_results');
        Schema::dropIfExists('scrape_sessions');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::create('scrape_sessions', function (Blueprint $table) {
            $table->id();
            $table->enum('status', ['success', 'failed']);
            $table->timestamp('started_at');
            $table->timestamp('finished_at');
        });

        Schema::create('scrape_results', function (Blueprint $table) {
            $table->id();
            $table->foreignId('session_id')->constrained('scrape_sessions')->cascadeOnDelete();
            $table->string('category');
            $table->unsignedInteger('total');
            $table->unsignedInteger('inserted');
            $table->unsignedInteger('skipped');
        });
    }
};
