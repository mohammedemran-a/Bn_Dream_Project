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
        Schema::create('football_matches', function (Blueprint $table) {
            $table->id();
             $table->string('team1'); 
            $table->string('team2'); 
            $table->string('team1_logo')->nullable();
            $table->string('team2_logo')->nullable();
            $table->date('date');    
            $table->time('time');    
            $table->string('channel'); 
            $table->string('result')->nullable();  
            $table->enum('status', ['قادمة', 'منتهية', 'جارية'])->default('قادمة'); 
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('football_matches');
    }
};
