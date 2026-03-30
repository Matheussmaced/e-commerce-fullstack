<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Home');
});

Route::get('/products', function () {
    return Inertia::render('Products/Index');
});

Route::get('/products/{id}', function ($id) {
    return Inertia::render('Products/Show', [
        'id' => $id
    ]);
});

Route::get('/cart', function () {
    return Inertia::render('Cart/Index');
});

Route::middleware(['auth'])->group(function () {

    Route::get('/checkout', function () {
        return Inertia::render('Checkout/Index');
    });

});
