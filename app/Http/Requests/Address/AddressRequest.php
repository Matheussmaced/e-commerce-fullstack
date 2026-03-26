<?php

namespace App\Http\Requests\Address;

use Illuminate\Foundation\Http\FormRequest;

class AddressRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $isRequired = $this->isMethod('post') ? 'required' : 'sometimes';

        return [
            'street' => "$isRequired|string|max:255",
            'number' => "$isRequired|integer",
            'complement' => 'nullable|string|max:255',
            'neighborhood' => "$isRequired|string|max:255",
            'city' => "$isRequired|string|max:255",
            'state' => "$isRequired|string|max:2",
            'zip_code' => "$isRequired|integer",
        ];
    }

    protected function failedValidation(\Illuminate\Contracts\Validation\Validator $validator)
    {
        throw new \Illuminate\Http\Exceptions\HttpResponseException(
            response()->json([
                'message' => 'The given data was invalid.',
                'errors' => $validator->errors(),
            ], 422)
        );
    }
}
