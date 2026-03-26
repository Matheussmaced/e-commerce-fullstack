<?php

namespace App\Http\Controllers\Api\Category;

use App\Http\Controllers\Controller;
use App\Http\Requests\Category\StoreCategoryRequest;
use App\Services\CategoryService;
use OpenApi\Attributes as OA;

#[OA\Tag(name: "Categories", description: "Gerenciamento de categorias do ecommerce")]
class CategoryController extends Controller
{
    public function __construct(
        protected CategoryService $categoryService
    ) {}

    #[OA\Get(
        path: "/api/v1/categories",
        summary: "Listar todas as categorias",
        description: "Retorna uma lista de categorias cadastradas",
        tags: ["Categories"],
        responses: [
            new OA\Response(
                response: 200,
                description: "Lista retornada com sucesso",
                content: new OA\JsonContent(
                    type: "array",
                    items: new OA\Items(
                        properties: [
                            new OA\Property(property: "id", type: "string", example: "c1c2c3"),
                            new OA\Property(property: "name", type: "string", example: "Eletrônicos"),
                            new OA\Property(property: "slug", type: "string", example: "eletronicos")
                        ]
                    )
                )
            )
        ]
    )]
    public function index()
    {
        return response()->json(
            $this->categoryService->getAll()
        );
    }

    #[OA\Post(
        path: "/api/v1/categories",
        summary: "Criar nova categoria",
        tags: ["Categories"],
        security: [["sanctum" => []]],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ["name", "slug"],
                properties: [
                    new OA\Property(property: "name", type: "string", example: "Roupas"),
                    new OA\Property(property: "slug", type: "string", example: "roupas")
                ]
            )
        ),
        responses: [
            new OA\Response(
                response: 201,
                description: "Categoria criada com sucesso",
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: "id", type: "string", example: "abc123"),
                        new OA\Property(property: "name", type: "string", example: "Roupas"),
                        new OA\Property(property: "slug", type: "string", example: "roupas")
                    ]
                )
            )
        ]
    )]
    public function store(StoreCategoryRequest $request)
    {
        $category = $this->categoryService->create(
            $request->validated()
        );

        return response()->json($category, 201);
    }

    #[OA\Get(
        path: "/api/v1/categories/{id}",
        summary: "Buscar categoria por ID",
        tags: ["Categories"],
        parameters: [
            new OA\Parameter(
                name: "id",
                in: "path",
                description: "ID da categoria",
                required: true,
                schema: new OA\Schema(type: "string", example: "abc123")
            )
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: "Categoria encontrada",
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: "id", type: "string", example: "abc123"),
                        new OA\Property(property: "name", type: "string", example: "Eletrônicos"),
                        new OA\Property(property: "slug", type: "string", example: "eletronicos")
                    ]
                )
            ),
            new OA\Response(
                response: 404,
                description: "Categoria não encontrada"
            )
        ]
    )]
    public function show($id)
    {
        return response()->json(
            $this->categoryService->getById($id)
        );
    }

    #[OA\Put(
        path: "/api/v1/categories/{id}",
        summary: "Atualizar categoria",
        tags: ["Categories"],
        security: [["sanctum" => []]],
        parameters: [
            new OA\Parameter(
                name: "id",
                in: "path",
                required: true,
                description: "ID da categoria",
                schema: new OA\Schema(type: "string", example: "abc123")
            )
        ],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: "name", type: "string", example: "Tecnologia"),
                    new OA\Property(property: "slug", type: "string", example: "tecnologia")
                ]
            )
        ),
        responses: [
            new OA\Response(
                response: 200,
                description: "Categoria atualizada",
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: "id", type: "string", example: "abc123"),
                        new OA\Property(property: "name", type: "string", example: "Tecnologia"),
                        new OA\Property(property: "slug", type: "string", example: "tecnologia")
                    ]
                )
            )
        ]
    )]
    public function update($id, StoreCategoryRequest $request)
    {
        return response()->json(
            $this->categoryService->update($id, $request->validated())
        );
    }

    #[OA\Delete(
        path: "/api/v1/categories/{id}",
        summary: "Remover categoria",
        tags: ["Categories"],
        security: [["sanctum" => []]],
        parameters: [
            new OA\Parameter(
                name: "id",
                in: "path",
                required: true,
                description: "ID da categoria",
                schema: new OA\Schema(type: "string", example: "abc123")
            )
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: "Categoria removida",
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: "message", type: "string", example: "Category deleted")
                    ]
                )
            )
        ]
    )]
    public function destroy($id)
    {
        $this->categoryService->delete($id);

        return response()->json([
            'message' => 'Category deleted'
        ]);
    }
}
