<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\RoomController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\UserController;

Route::prefix('auth')->group(function () {
    Route::post('login', [AuthController::class, 'login']);
    Route::post('register', [AuthController::class, 'register']);
    Route::post('logout', [AuthController::class, 'logout'])->middleware('auth:api');
    Route::get('me', [AuthController::class, 'me'])->middleware('auth:api');
    Route::post('refresh', [AuthController::class, 'refresh'])->middleware('auth:api');
});

Route::get('rooms/search', [RoomController::class, 'search']);
Route::get('rooms/{room}', [RoomController::class, 'show']);

// Public booking creation endpoint
Route::post('bookings', [BookingController::class, 'store']);

Route::middleware('auth:api')->group(function () {
    Route::get('bookings', [BookingController::class, 'index']);
    Route::post('bookings/{booking}/cancel', [BookingController::class, 'cancel']);

    Route::put('user', [UserController::class, 'update']);
    Route::post('user/change-password', [UserController::class, 'changePassword']);
});


