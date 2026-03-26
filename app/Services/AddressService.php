<?php

namespace App\Services;

use App\Models\Address;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class AddressService
{
    /**
     * Get user address.
     */
    public function getAddress(User $user)
    {
        return $user->address;
    }

    /**
     * Create or update address.
     */
    public function updateOrCreateAddress(User $user, array $data)
    {
        return $user->address()->updateOrCreate(
            ['user_id' => $user->id],
            $data
        );
    }

    /**
     * Update address.
     */
    public function updateAddress(Address $address, array $data)
    {
        $address->update($data);
        return $address;
    }

    /**
     * Delete address.
     */
    public function deleteAddress(Address $address)
    {
        return $address->delete();
    }
}
