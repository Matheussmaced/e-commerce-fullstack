<?php

namespace App\Services;

use App\Repositories\CategoryRepository;
use Illuminate\Support\Str;

class CategoryService
{
    public function __construct(
        protected CategoryRepository $categoryRepository
    ) {}

    public function getAll()
    {
        return $this->categoryRepository->getAll();
    }

    public function getById($id)
    {
        return $this->categoryRepository->findById($id);
    }

    public function create(array $data)
    {
        $data['slug'] = Str::slug($data['name']);

        return $this->categoryRepository->create($data);
    }

    public function update($id, array $data)
    {
        if(isset($data['name'])){
            $data['slug'] = Str::slug($data['name']);
        }

        return $this->categoryRepository->update($id, $data);
    }

    public function delete($id)
    {
        return $this->categoryRepository->delete($id);
    }
}
