<?php

namespace App\Repositories;

use App\Models\Cart;

class CartRepository
{
    public function getAll($userId = null)
    {
        if ($userId) {
            return Cart::where('user_id', $userId)->get();
        }
        return Cart::all();
    }

    public function findActiveByUser($userId)
    {
        return Cart::where('user_id', $userId)
            ->where('status', 'active')
            ->first();
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
