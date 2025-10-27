<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\RoomController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\FootballMatchController;

Route::apiResource('rooms', RoomController::class);

Route::apiResource('products', ProductController::class);


Route::apiResource('football-matches', FootballMatchController::class);
