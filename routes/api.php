<?php

use App\Http\Controllers\Api\Category\Category1Controller;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\Category\CategoryController;
use App\Http\Controllers\Api\Product\ProductController;

Route::prefix('v1')->group(function () {

    Route::apiResource('categories', CategoryController::class);
    Route::apiResource('categories1', Category1Controller::class);
    Route::apiResource('products', ProductController::class);
});
