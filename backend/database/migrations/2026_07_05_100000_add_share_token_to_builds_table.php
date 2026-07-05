<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('builds', function (Blueprint $table) {
            $table->boolean('is_public')->default(false)->index();
            $table->uuid('share_token')->nullable()->unique()->after('is_public');
        });
    }

    public function down(): void
    {
        Schema::table('builds', function (Blueprint $table) {
            $table->dropColumn(['share_token', 'is_public']);
        });
    }
};
