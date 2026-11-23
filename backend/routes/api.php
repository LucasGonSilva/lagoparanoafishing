<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ContentController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\SettingController;
use App\Http\Controllers\Api\SiteController;
use App\Http\Controllers\Api\UploadController;
use Illuminate\Support\Facades\Route;

Route::get('/site', [SiteController::class, 'index']);
Route::get('/events/{slug}', [SiteController::class, 'event']);
Route::get('/species/{slug}', [SiteController::class, 'species']);
Route::get('/posts/{slug}', [SiteController::class, 'post']);
Route::get('/products/{slug}', [SiteController::class, 'product']);
Route::get('/clients/{slug}', [SiteController::class, 'client']);

Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:8,1');

Route::middleware('auth:sanctum')->prefix('admin')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::put('/profile', [AuthController::class, 'update']);
    Route::get('/users', [AuthController::class, 'index']);
    Route::post('/users', [AuthController::class, 'store']);
    Route::put('/users/{id}', [AuthController::class, 'updateUser'])->whereNumber('id');
    Route::delete('/users/{id}', [AuthController::class, 'destroy'])->whereNumber('id');
    Route::get('/stats', [DashboardController::class, 'index']);
    Route::get('/settings', [SettingController::class, 'show']);
    Route::put('/settings', [SettingController::class, 'update']);
    Route::post('/uploads', [UploadController::class, 'store']);

    Route::prefix('content')->where(['type' => 'rules|events|species|posts|gallery|faqs|products|clients'])->group(function () {
        Route::get('/{type}', [ContentController::class, 'index']);
        Route::post('/{type}', [ContentController::class, 'store']);
        Route::put('/{type}/{id}', [ContentController::class, 'update'])->whereNumber('id');
        Route::delete('/{type}/{id}', [ContentController::class, 'destroy'])->whereNumber('id');
    });
});
