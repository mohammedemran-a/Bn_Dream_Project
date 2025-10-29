<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\RoomController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\FootballMatchController;
use App\Http\Controllers\AuthController;
use Illuminate\Http\Request;
use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\SettingController;

// مسار لجلب الإعدادات
Route::get('/settings', [SettingController::class, 'index']);

// مسار لحفظ الإعدادات
Route::post('/settings', [SettingController::class, 'update']);


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


Route::get('/orders', [OrderController::class, 'index']);
Route::get('/orders/{id}', [OrderController::class, 'show']);
Route::get('/orders/user/{userId}', [OrderController::class, 'getOrdersByUser']);
Route::post('/orders', [OrderController::class, 'store']);
Route::put('/orders/{id}/status', [OrderController::class, 'updateStatus']);
Route::delete('/orders/{id}', [OrderController::class, 'destroy']);


