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
use App\Http\Controllers\Api\PredictionController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\RolePermissionController;
use App\Http\Controllers\Api\NotificationController;

Route::post('/predictions', [PredictionController::class, 'store']);
Route::get('/predictions/user/{user_id}', [PredictionController::class, 'getUserPredictions']);
Route::get('/predictions/leaderboard', [PredictionController::class, 'leaderboard']);

Route::get('/settings', [SettingController::class, 'index']);

// مسار لحفظ الإعدادات
Route::post('/settings', [SettingController::class, 'update']);


Route::apiResource('rooms', RoomController::class);

Route::apiResource('products', ProductController::class);


Route::apiResource('football-matches', FootballMatchController::class);



Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    Route::get('/users', [AuthController::class, 'allUsers']);
    Route::post('/users', [AuthController::class, 'store']);
    Route::put('/users/{id}', [AuthController::class, 'updateUser']);
    Route::delete('/users/{id}', [AuthController::class, 'deleteUser']);
});




Route::get('/orders', [OrderController::class, 'index']);
Route::get('/orders/{id}', [OrderController::class, 'show']);
Route::get('/orders/user/{userId}', [OrderController::class, 'getOrdersByUser']);
Route::post('/orders', [OrderController::class, 'store']);
Route::put('/orders/{id}/status', [OrderController::class, 'updateStatus']);
Route::delete('/orders/{id}', [OrderController::class, 'destroy']);



// ✅ إرسال رسالة جديدة من نموذج التواصل
Route::post('/contact', [ContactController::class, 'store']);

// ✅ عرض جميع الرسائل (اختياري)
Route::get('/contact', [ContactController::class, 'index']);


// Route::middleware(['auth:sanctum'])->group(function () {
//     Route::get('/roles', [RolePermissionController::class, 'index']);
//     Route::get('/permissions', [RolePermissionController::class, 'permissions']);
//     Route::post('/roles', [RolePermissionController::class, 'store']);
//     Route::put('/roles/{id}', [RolePermissionController::class, 'update']);
//     Route::delete('/roles/{id}', [RolePermissionController::class, 'destroy']);
// }); 

Route::get('/roles', [RolePermissionController::class, 'index']);
    Route::get('/permissions', [RolePermissionController::class, 'permissions']);
    Route::post('/roles', [RolePermissionController::class, 'store']);
    Route::put('/roles/{id}', [RolePermissionController::class, 'update']);
    Route::delete('/roles/{id}', [RolePermissionController::class, 'destroy']);




Route::apiResource('bookings', BookingController::class);



Route::middleware('auth:sanctum')->group(function () {
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::get('/notifications/unread', [NotificationController::class, 'unread']);
    Route::post('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);
    Route::delete('/notifications/{id}', [NotificationController::class, 'destroy']);
    Route::delete('/notifications', [NotificationController::class, 'clearAll']);
});
