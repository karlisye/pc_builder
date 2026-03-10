<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('builds', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->index();
            $table->string('name');
            $table->text('notes')->nullable();
            $table->decimal('total_price', 10, 2)->nullable();

            $table->foreignId('cpu_id')->nullable()->constrained('cpus')->nullOnDelete();
            $table->foreignId('motherboard_id')->nullable()->constrained('motherboards')->nullOnDelete();
            $table->foreignId('ram_id')->nullable()->constrained('ram')->nullOnDelete();
            $table->foreignId('gpu_id')->nullable()->constrained('gpus')->nullOnDelete();
            $table->foreignId('ssd_id')->nullable()->constrained('ssds')->nullOnDelete();
            $table->foreignId('hdd_id')->nullable()->constrained('hdds')->nullOnDelete();
            $table->foreignId('case_id')->nullable()->constrained('cases')->nullOnDelete();
            $table->foreignId('cooler_id')->nullable()->constrained('coolers')->nullOnDelete();
            $table->foreignId('psu_id')->nullable()->constrained('psus')->nullOnDelete();
            $table->foreignId('fan_id')->nullable()->constrained('fans')->nullOnDelete();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('builds');
    }
};
