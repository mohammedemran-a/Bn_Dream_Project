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
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('room_id')->constrained()->onDelete('cascade');
            $table->dateTime('check_in');
            $table->dateTime('check_out');
            $table->integer('guests');
            $table->decimal('total_price', 10, 2);
            $table->enum('status', ['قيد المراجعة', 'مؤكد', 'ملغي'])->default('قيد المراجعة');
            $table->enum('duration_type', ['hours', 'days']);
            $table->integer('duration_value');

            $table->enum('payment_method', ['cash', 'wallet'])->default('cash');
            $table->string('wallet_code')->nullable();
            $table->enum('wallet_type', ['جوالي', 'جيب', 'ون كاش'])->nullable();


            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};
