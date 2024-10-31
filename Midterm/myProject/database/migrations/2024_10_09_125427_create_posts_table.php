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
        Schema::create('posts', function (Blueprint $table) {
            $table->id();  // Auto-incrementing primary key
            $table->foreignId('user_id')->nullable(); // Reference to user table
            $table->string('title');  // Title of the post
            $table->text('content');  // Body content of the post
            $table->string('image');  // Optional image field
            $table->unsignedInteger('likes_count')->default(0); // To keep track of likes count
            $table->unsignedInteger('comments_count')->default(0); // To keep track of comments count
            $table->timestamps();  // Created and updated timestamps
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('likes');  // Drop likes table first
        Schema::dropIfExists('comments');  // Drop comments table first
        Schema::dropIfExists('posts');  // Finally, drop posts table
    }
    
};
