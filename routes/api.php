<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\Category\CategoryController;

Route::prefix('v1')->group(function () {

    Route::apiResource('categories', CategoryController::class);

});
