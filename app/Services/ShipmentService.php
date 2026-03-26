<?php

namespace App\Services;

use App\Models\Shipment;
use Illuminate\Support\Facades\DB;

class ShipmentService
{
    /**
     * Get shipment by order ID.
     */
    public function getShipmentByOrder(string $orderId)
    {
        return Shipment::where('order_id', $orderId)->first();
    }

    /**
     * Create a new shipment.
     */
    public function createShipment(array $data)
    {
        return Shipment::create($data);
    }

    /**
     * Update shipment status and tracking code.
     */
    public function updateShipment(string $id, array $data)
    {
        $shipment = Shipment::findOrFail($id);
        $shipment->update($data);
        return $shipment;
    }
}
