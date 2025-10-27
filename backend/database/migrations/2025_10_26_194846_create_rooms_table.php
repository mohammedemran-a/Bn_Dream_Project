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
        Schema::create('rooms', function (Blueprint $table) {
            $table->id();
            $table->enum('category', [
                'غرف خاصة',
                'غرف عامة',
                'صالات المناسبات',
                'غرف البلايستيشن',
                'صالات البلياردو'
            ]);
            $table->string('name');
            $table->decimal('price', 10, 2)->default(0);
            $table->enum('status', ['متاح', 'محجوز'])->default('متاح');
            $table->integer('capacity')->default(1);
            $table->text('description')->nullable();
            $table->string('features')->nullable();
            $table->string('image_path')->nullable(); // مسار الصورة المرفوعة
 
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rooms');
    }
};
