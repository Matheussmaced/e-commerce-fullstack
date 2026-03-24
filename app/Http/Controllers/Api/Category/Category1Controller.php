<?php

namespace App\Http\Controllers\Api\Category;

use App\Http\Controllers\Controller;
use App\Http\Requests\Category\StoreCategoryRequest;
use App\Services\NewCategoryService;
use Illuminate\Http\Request;
/**
 * @tags Categorias
 */
class Category1Controller extends Controller
{
    public function __construct(
        protected NewCategoryService $categoryService
    ){}

    /**
     * Listar todas as categorias
     * 
     * Retorna uma lista de categorias cadastradas
     */
    public function index()
    {
        try{
            $categories = $this->categoryService->index();
            if(count($categories) === 0){
                return response()->json([
                    'message' => 'Nenhuma categoria encontrada'
                ], 404);
            }
            return response()->json($categories);
        }catch(\Exception $e){
            return response()->json([
                'message' => 'Erro ao listar categorias',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Cria nova categoria
     * 
     * Cria uma nova categoria com os dados fornecidos
     */
    public function store(StoreCategoryRequest $request)
    {
        try{
            $data = $request->validated();
            $category = $this->categoryService->store($data);
            return response()->json($category, 201);
        }catch(\Exception $e){
            return response()->json([
                'message' => 'Erro ao criar categoria',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
