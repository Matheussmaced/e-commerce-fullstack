<?php

namespace App\Repositories;

use App\Models\Cart;

class CartRepository
{
    public function getAll()
    {
        return Cart::all();
    }

    public function findById($id)
    {
        return Cart::find($id);
    }

    public function create(array $data)
    {
        return Cart::create($data);
    }

    public function delete($id)
    {
        $cart = Cart::findOrFail($id);
        $cart->delete();
    }
}
