<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('(public)/Home');
});

Route::get('/products', function () {
    return Inertia::render('(public)/Products/Index');
});

Route::get('/products/{id}', function ($id) {
    return Inertia::render('(public)/Products/Show', [
        'id' => $id
    ]);
});

Route::get('/cart', function () {
    return Inertia::render('(public)/Cart/Index');
});

Route::get('/checkout', function () {
    return Inertia::render('(private)/Checkout/Index');
});

Route::get('/dashboard', function () {
    return Inertia::render('(private)/Admin/Dashboard');
});

Route::middleware(['auth'])->group(function () {
    // Other routes that strictly require a session
});

require __DIR__.'/auth.php';
require __DIR__.'/settings.php';
