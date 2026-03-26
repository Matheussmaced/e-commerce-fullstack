<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Order extends Model
{
    use HasUuids;

    protected $fillable = [
        'user_id',
        'total_amount',
        'status',
        'street',
        'number',
        'complement',
        'neighborhood',
        'city',
        'state',
        'zip_code',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the shipment associated with the order.
     */
    public function shipment(): \Illuminate\Database\Eloquent\Relations\HasOne
    {
        return $this->hasOne(Shipment::class);
    }

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }
}
