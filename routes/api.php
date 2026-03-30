<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\Category\CategoryController;
use App\Http\Controllers\Api\Product\ProductController;
use App\Http\Controllers\Api\Cart\CartController;
use App\Http\Controllers\Api\User\UserController;
use App\Http\Controllers\Api\Auth\AuthController;
use App\Http\Controllers\Api\CartItem\CartItemController;
use App\Http\Controllers\Api\Checkout\CheckoutController;
use App\Http\Controllers\Api\Order\OrderController;
use App\Http\Controllers\Api\OrderItem\OrderItemController;
use App\Http\Controllers\Api\Payment\PaymentController;
use App\Http\Controllers\Api\Address\AddressController;
use App\Http\Controllers\Api\Shipment\ShipmentController;

Route::prefix('v1')->group(function () {
    // 1. Rotas Públicas
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
    Route::post('/reset-password', [AuthController::class, 'resetPassword']);
    Route::get('/verify-email/{id}/{hash}', [AuthController::class, 'verifyEmail'])->name('api.v1.verification.verify');

    // Listagem pública
    Route::get('/categories', [CategoryController::class, 'index']);
    Route::get('/categories/{id}', [CategoryController::class, 'show']);
    Route::get('/products', [ProductController::class, 'index']);
    Route::get('/products/{id}', [ProductController::class, 'show']);

    // 2. Rotas Protegidas (Usuário Comum)
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::post('/confirm-password', [AuthController::class, 'confirmPassword']);
        Route::post('/email/verification-notification', [AuthController::class, 'resendVerification']);

        // Perfil do Usuário
        Route::get('/me', [\App\Http\Controllers\Api\Profile\ProfileController::class, 'show']);
        Route::put('/me', [\App\Http\Controllers\Api\Profile\ProfileController::class, 'update']);
        Route::delete('/me', [\App\Http\Controllers\Api\Profile\ProfileController::class, 'destroy']);

        // Carrinho e Checkout
        Route::apiResource('carts', CartController::class);
        Route::get('/carts/{cart_id}/items', [CartItemController::class, 'index']);
        Route::post('/cart-items', [CartItemController::class, 'store']);
        Route::put('/cart-items/{id}', [CartItemController::class, 'update']);
        Route::delete('/cart-items/{id}', [CartItemController::class, 'destroy']);

        Route::post('/checkout', [CheckoutController::class, 'store']);
        Route::post('/payments', [PaymentController::class, 'store']);

        // Addresses
        Route::apiResource('addresses', AddressController::class)->except(['show']);

        // Shipments
        Route::get('shipments/order/{order_id}', [ShipmentController::class, 'show']);
        Route::patch('shipments/{id}', [ShipmentController::class, 'update']);

        // Pedidos
        Route::get('/orders', [OrderController::class, 'index']);
        Route::get('/orders/{id}', [OrderController::class, 'show']);
        Route::get('/orders/{order_id}/items', [OrderItemController::class, 'index']);

        // 3. Rotas de Administrador
        Route::middleware('admin')->group(function () {
            // Gerenciamento de Categorias
            Route::post('/categories', [CategoryController::class, 'store']);
            Route::put('/categories/{id}', [CategoryController::class, 'update']);
            Route::delete('/categories/{id}', [CategoryController::class, 'destroy']);

            // Gerenciamento de Produtos
            Route::post('/products', [ProductController::class, 'store']);
            Route::put('/products/{id}', [ProductController::class, 'update']);
            Route::delete('/products/{id}', [ProductController::class, 'destroy']);

            // Gerenciamento de Usuários
            Route::get('/users', [UserController::class, 'index']);
            Route::get('/users/{id}', [UserController::class, 'show']);
        });
    });
});
