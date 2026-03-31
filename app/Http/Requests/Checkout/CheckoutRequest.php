<?php

namespace App\Http\Requests\Checkout;

use Illuminate\Foundation\Http\FormRequest;

class CheckoutRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'cart_id' => 'required|uuid|exists:carts,id,status,active',
            'address' => 'required|array',
            'address.zip_code' => 'required|string|max:20',
            'address.street' => 'required|string|max:255',
            'address.number' => 'required|string|max:20',
            'address.complement' => 'nullable|string|max:255',
            'address.neighborhood' => 'required|string|max:100',
            'address.city' => 'required|string|max:100',
            'address.state' => 'required|string|max:2',
        ];
    }
}
