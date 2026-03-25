<?php

namespace App\Services;

use App\Models\CartItem;
use App\Models\Product;

class CartItemService
{

    public function getByCart($cartId)
    {
        return CartItem::where('cart_id', $cartId)
            ->with('product')
            ->get();
    }

    public function create(array $data)
    {
        $product = Product::findOrFail($data['product_id']);

        return CartItem::create([
            'cart_id' => $data['cart_id'],
            'product_id' => $data['product_id'],
            'quantity' => $data['quantity'],
            'price' => $product->price
        ]);
    }

    public function update($id, array $data)
    {
        $item = CartItem::findOrFail($id);

        $item->update([
            'quantity' => $data['quantity']
        ]);

        return $item;
    }

    public function delete($id)
    {
        $item = CartItem::findOrFail($id);

        $item->delete();
    }
}