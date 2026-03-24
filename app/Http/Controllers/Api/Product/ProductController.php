<?php

namespace App\Http\Controllers\Api\Product;

use App\Http\Controllers\Controller;
use App\Http\Requests\Product\StoreProductRequest;
use App\Services\ProductService;
use OpenApi\Attributes as OA;

#[OA\Tag(name: "Products", description: "Gerenciamento de produtos do ecommerce")]
class ProductController extends Controller
{
    public function __construct(
        protected ProductService $productService
    ) {}

    #[OA\Get(
        path: "/api/v1/products",
        summary: "Listar produtos",
        description: "Retorna todos os produtos cadastrados",
        tags: ["Products"],
        responses: [
            new OA\Response(
                response: 200,
                description: "Lista de produtos",
                content: new OA\JsonContent(
                    type: "array",
                    items: new OA\Items(
                        properties: [
                            new OA\Property(property: "id", type: "string", example: "abc123"),
                            new OA\Property(property: "name", type: "string", example: "Notebook"),
                            new OA\Property(property: "description", type: "string", example: "Notebook gamer"),
                            new OA\Property(property: "price", type: "number", example: 5999.90),
                            new OA\Property(property: "stock", type: "integer", example: 10),
                            new OA\Property(property: "category_id", type: "string", example: "cat123")
                        ]
                    )
                )
            )
        ]
    )]
    public function index()
    {
        return response()->json(
            $this->productService->getAll()
        );
    }

    #[OA\Post(
        path: "/api/v1/products",
        summary: "Criar produto",
        tags: ["Products"],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ["name", "price", "stock", "category_id"],
                properties: [
                    new OA\Property(property: "name", type: "string", example: "Notebook"),
                    new OA\Property(property: "description", type: "string", example: "Notebook gamer"),
                    new OA\Property(property: "price", type: "number", example: 5999.90),
                    new OA\Property(property: "stock", type: "integer", example: 10),
                    new OA\Property(property: "category_id", type: "string", example: "cat123")
                ]
            )
        ),
        responses: [
            new OA\Response(
                response: 201,
                description: "Produto criado com sucesso"
            )
        ]
    )]
    public function store(StoreProductRequest $request)
    {
        $product = $this->productService->create(
            $request->validated()
        );

        return response()->json($product, 201);
    }

    #[OA\Get(
        path: "/api/v1/products/{id}",
        summary: "Buscar produto por ID",
        tags: ["Products"],
        parameters: [
            new OA\Parameter(
                name: "id",
                in: "path",
                required: true,
                description: "ID do produto",
                schema: new OA\Schema(type: "string", example: "abc123")
            )
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: "Produto encontrado"
            ),
            new OA\Response(
                response: 404,
                description: "Produto não encontrado"
            )
        ]
    )]
    public function show($id)
    {
        return response()->json(
            $this->productService->getById($id)
        );
    }

    #[OA\Put(
        path: "/api/v1/products/{id}",
        summary: "Atualizar produto",
        tags: ["Products"],
        parameters: [
            new OA\Parameter(
                name: "id",
                in: "path",
                required: true,
                description: "ID do produto",
                schema: new OA\Schema(type: "string", example: "abc123")
            )
        ],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: "name", type: "string", example: "Notebook atualizado"),
                    new OA\Property(property: "description", type: "string", example: "Descrição atualizada"),
                    new OA\Property(property: "price", type: "number", example: 4999.90),
                    new OA\Property(property: "stock", type: "integer", example: 8)
                ]
            )
        ),
        responses: [
            new OA\Response(
                response: 200,
                description: "Produto atualizado"
            )
        ]
    )]
    public function update($id, StoreProductRequest $request)
    {
        return response()->json(
            $this->productService->update($id, $request->validated())
        );
    }

    #[OA\Delete(
        path: "/api/v1/products/{id}",
        summary: "Remover produto",
        tags: ["Products"],
        parameters: [
            new OA\Parameter(
                name: "id",
                in: "path",
                required: true,
                description: "ID do produto",
                schema: new OA\Schema(type: "string", example: "abc123")
            )
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: "Produto removido"
            )
        ]
    )]
    public function destroy($id)
    {
        $this->productService->delete($id);

        return response()->json([
            'message' => 'Product deleted'
        ]);
    }
}
