<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('client_trips', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->string('location');
            $table->date('fished_on')->nullable();
            $table->unsignedInteger('fish_count')->nullable();
            $table->text('anglers');
            $table->string('guide')->default('Galegão da Pesca');
            $table->longText('notes')->nullable();
            $table->json('photos')->nullable();
            $table->json('videos')->nullable();
            $table->unsignedInteger('position')->default(0);
            $table->boolean('active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('client_trips');
    }
};
