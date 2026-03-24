<?php

namespace App\Http\Requests\Category;

use Illuminate\Foundation\Http\FormRequest;

class StoreCategoryRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            // Nome da categoria
            'name' => 'required|string|max:255',
            // Slug da categoria
            'slug' => 'required|string|max:255|unique:categories,slug',
        ];
    }
    public function messages(): array
    {
        return [
            'name.required' => 'O nome da categoria é obrigatório.',
            'name.string' => 'O nome da categoria deve ser uma string.',
            'name.max' => 'O nome da categoria não pode exceder 255 caracteres.',
            'slug.required' => 'O slug da categoria é obrigatório.',
            'slug.string' => 'O slug da categoria deve ser uma string.',
            'slug.max' => 'O slug da categoria não pode exceder 255 caracteres.',
            'slug.unique' => 'O slug da categoria já existe. Por favor, escolha outro.',
        ];
    }
}
