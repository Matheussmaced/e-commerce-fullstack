<?php

namespace App\Http\Requests\CartItem;

use Illuminate\Foundation\Http\FormRequest;

class StoreCartItemRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'cart_id' => 'required|uuid|exists:carts,id',
            'product_id' => 'required|uuid|exists:products,id',
            'quantity' => 'required|integer|min:1'
        ];
    }
}