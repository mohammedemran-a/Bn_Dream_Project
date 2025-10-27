<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\RoomController;
use App\Http\Controllers\Api\ProductController;


Route::apiResource('rooms', RoomController::class);

Route::apiResource('products', ProductController::class);
