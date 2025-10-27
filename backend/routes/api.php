<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\RoomController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\FootballMatchController;
use App\Http\Controllers\AuthController;
use Illuminate\Http\Request;
use App\Http\Controllers\Api\BookingController;

Route::apiResource('rooms', RoomController::class);

Route::apiResource('products', ProductController::class);


Route::apiResource('football-matches', FootballMatchController::class);


// الحصول على المستخدم المسجل
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// تسجيل الدخول والخروج والتسجيل
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');


Route::apiResource('bookings', BookingController::class);
