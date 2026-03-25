<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\Category\CategoryController;
use App\Http\Controllers\Api\Product\ProductController;
use App\Http\Controllers\Api\Cart\CartController;
use App\Http\Controllers\Api\User\UserController;
use App\Http\Controllers\Api\Auth\AuthController;
use App\Http\Controllers\Api\CartItem\CartItemController;

Route::prefix('v1')->group(function () {
    // Rotas Públicas (Não precisam de login)
    Route::post('/register', [AuthController::class , 'register']);
    Route::post('/login', [AuthController::class , 'login']);
    Route::post('/forgot-password', [AuthController::class , 'forgotPassword']);
    Route::post('/reset-password', [AuthController::class , 'resetPassword']);

    // Rotas Protegidas (Precisa estar logado)
    Route::middleware('auth:sanctum')->group(function () {
            Route::post('/logout', [AuthController::class , 'logout']);
            Route::post('/confirm-password', [AuthController::class , 'confirmPassword']);
            Route::post('/email/verification-notification', [AuthController::class , 'resendVerification']);
        }
        );

        // Verificação de Email
        Route::get('/verify-email/{id}/{hash}', [AuthController::class , 'verifyEmail'])->name('api.v1.verification.verify');

        // Rotas Protegidas (Precisa estar logado)
        Route::apiResource('categories', CategoryController::class);
        Route::apiResource('products', ProductController::class);
        Route::apiResource('carts', CartController::class);
        Route::get('/users', [UserController::class , 'index']);
        Route::get('/users/{id}', [UserController::class , 'show']);

        Route::get('/carts/{cart_id}/items', [CartItemController::class , 'index']);

        Route::post('/cart-items', [CartItemController::class , 'store']);

        Route::put('/cart-items/{id}', [CartItemController::class , 'update']);

        Route::delete('/cart-items/{id}', [CartItemController::class , 'destroy']);
    });
