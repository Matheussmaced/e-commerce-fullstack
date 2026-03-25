<?php

namespace App\Services;

use App\Models\OrderItem;
use App\Models\Order;
use Illuminate\Support\Facades\Auth;

class OrderItemService
{
    public function getItemsByOrder(string $orderId)
    {
        // Ensure the order belongs to the authenticated user
        $order = Order::where('id', $orderId)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        return OrderItem::where('order_id', $orderId)
            ->with('product')
            ->get();
    }
}
