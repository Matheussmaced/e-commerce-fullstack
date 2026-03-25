<?php

namespace App\Services;

use App\Models\Order;
use Illuminate\Support\Facades\Auth;

class OrderService
{
    public function listUserOrders()
    {
        return Order::where('user_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->get();
    }

    public function getOrderDetails(string $id)
    {
        return Order::where('user_id', Auth::id())
            ->with(['items.product'])
            ->findOrFail($id);
    }
}
