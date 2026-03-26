<?php

namespace App\Services;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Services\ShipmentService;
use Illuminate\Support\Facades\DB;
use Exception;

class CheckoutService
{
    public function __construct(
        protected ShipmentService $shipmentService
    ) {}

    public function processCheckout(string $cartId)
    {
        return DB::transaction(function () use ($cartId) {
            $cart = Cart::findOrFail($cartId);
            $cartItems = CartItem::where('cart_id', $cartId)->with('product')->get();

            if ($cartItems->isEmpty()) {
                throw new Exception('Cart is empty');
            }

            $totalAmount = 0;
            foreach ($cartItems as $item) {
                if ($item->product->stock < $item->quantity) {
                    throw new Exception("Product {$item->product->name} does not have enough stock");
                }
                $totalAmount += $item->price * $item->quantity;
            }

            $user = $cart->user;
            $address = $user->address;

            if (!$address) {
                throw new Exception('User address not found. Please provide an address before checkout.');
            }

            $order = Order::create([
                'user_id' => $cart->user_id,
                'total_amount' => $totalAmount,
                'status' => 'pending',
                'street' => $address->street,
                'number' => $address->number,
                'complement' => $address->complement,
                'neighborhood' => $address->neighborhood,
                'city' => $address->city,
                'state' => $address->state,
                'zip_code' => $address->zip_code,
            ]);

            foreach ($cartItems as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item->product_id,
                    'quantity' => $item->quantity,
                    'unit_price' => $item->price,
                    'total_price' => $item->price * $item->quantity
                ]);

                // Decrement stock
                $item->product->decrement('stock', $item->quantity);
            }

            // Update cart status or clear it
            $cart->update(['status' => 'completed']);
            CartItem::where('cart_id', $cartId)->delete();

            // Create Shipment via Service
            $this->shipmentService->createShipment([
                'order_id' => $order->id,
                'shipping_cost' => 15.00,
                'status' => 'preparing',
            ]);

            return $order->load(['items.product', 'shipment']);
        });
    }
}
