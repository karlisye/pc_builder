<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::dropIfExists('build_comment_likes');
        Schema::dropIfExists('build_comments');
        Schema::dropIfExists('build_likes');
        Schema::dropIfExists('build_reviews');

        Schema::table('builds', function (Blueprint $table) {
            $table->dropColumn('is_public');
        });
    }

    public function down(): void
    {
        Schema::table('builds', function (Blueprint $table) {
            $table->boolean('is_public')->default(false)->index();
        });

        Schema::create('build_likes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('build_id')->constrained()->cascadeOnDelete();
            $table->timestamps();
        });

        Schema::create('build_reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('build_id')->constrained()->cascadeOnDelete();
            $table->tinyInteger('rating')->unsigned()->index();
            $table->unique(['user_id', 'build_id']);
            $table->timestamps();
        });

        Schema::create('build_comments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('build_id')->constrained()->cascadeOnDelete();
            $table->foreignId('parent_id')->nullable()->constrained('build_comments')->cascadeOnDelete();
            $table->text('body');
            $table->timestamps();
        });

        Schema::create('build_comment_likes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('comment_id')->constrained('build_comments')->cascadeOnDelete();
            $table->unique(['user_id', 'comment_id']);
            $table->timestamps();
        });
    }
};
