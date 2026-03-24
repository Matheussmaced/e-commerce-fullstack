<?php

namespace App\Services;

use App\Models\Category;

class NewCategoryService
{
    public function index()
    {
        try {
            return Category::all();
        } catch (\Exception $e) {
            throw new \Exception('Erro ao listar categorias: '.$e->getMessage());
        }
    }

    public function store(array $data)
    {
        try {
            return Category::create($data);
        } catch (\Exception $e) {
            throw new \Exception('Erro ao criar categoria: '.$e->getMessage());
        }
    }
}
