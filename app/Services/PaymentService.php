<?php

namespace App\Services;

use App\Models\Order;
use App\Models\Payment;
use Illuminate\Support\Facades\DB;
use Exception;
use Illuminate\Support\Str;

class PaymentService
{
    public function processPayment(array $data)
    {
        return DB::transaction(function () use ($data) {
            $order = Order::findOrFail($data['order_id']);

            if ($order->status !== 'pending') {
                throw new Exception('Order is not in a pending state');
            }

            // Mocking payment processing
            $transactionId = 'TXN-' . strtoupper(Str::random(10));
            $status = 'paid'; // In a real scenario, this would come from a gateway

            $payment = Payment::create([
                'order_id' => $order->id,
                'amount' => $order->total_amount,
                'payment_method' => $data['payment_method'],
                'status' => $status,
                'transaction_id' => $transactionId
            ]);

            if ($status === 'paid') {
                $order->update(['status' => 'paid']);
            }

            return $payment->load('order');
        });
    }
}
