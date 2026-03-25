<?php

namespace App\Http\Controllers\Api\Cart;

use App\Http\Controllers\Controller;
use App\Http\Requests\Cart\CartRequest;
use App\Services\CartService;
use OpenApi\Attributes as OA;

#[OA\Tag(name: "Carts", description: "Gerenciamento de carrinhos do ecommerce")]
class CartController extends Controller
{
    public function __construct(
        protected CartService $cartService
    ) {}

    #[OA\Get(
        path: "/api/v1/carts",
        summary: "Listar carrinhos",
        tags: ["4. Carts"],
        responses: [
            new OA\Response(
                response: 200,
                description: "Lista de carrinhos",
                content: new OA\JsonContent(
                    type: "array",
                    items: new OA\Items(
                        properties: [
                            new OA\Property(property: "id", type: "string", example: "uuid123"),
                            new OA\Property(property: "user_id", type: "string", example: "user123"),
                            new OA\Property(property: "status", type: "string", example: "active")
                        ]
                    )
                )
            )
        ]
    )]
    public function index()
    {
        return response()->json(
            $this->cartService->index()
        );
    }

    #[OA\Post(
        path: "/api/v1/carts",
        summary: "Criar carrinho",
        tags: ["4. Carts"],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: "user_id", type: "string", example: "uuid-user"),
                    new OA\Property(property: "status", type: "string", example: "active")
                ]
            )
        ),
        responses: [
            new OA\Response(
                response: 201,
                description: "Carrinho criado",
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: "id", type: "string", example: "uuid123"),
                        new OA\Property(property: "user_id", type: "string", example: "uuid-user"),
                        new OA\Property(property: "status", type: "string", example: "active")
                    ]
                )
            )
        ]
    )]
    public function store(CartRequest $request)
    {
        $cart = $this->cartService->store(
            $request->validated()
        );

        return response()->json($cart, 201);
    }

    #[OA\Get(
        path: "/api/v1/carts/{id}",
        summary: "Buscar carrinho por ID",
        tags: ["4. Carts"],
        parameters: [
            new OA\Parameter(
                name: "id",
                in: "path",
                required: true,
                description: "ID do carrinho",
                schema: new OA\Schema(type: "string", example: "uuid123")
            )
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: "Carrinho encontrado",
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: "id", type: "string", example: "uuid123"),
                        new OA\Property(property: "user_id", type: "string", example: "uuid-user"),
                        new OA\Property(property: "status", type: "string", example: "active")
                    ]
                )
            ),
            new OA\Response(
                response: 404,
                description: "Carrinho não encontrado"
            )
        ]
    )]
    public function show($id)
    {
        return response()->json(
            $this->cartService->show($id)
        );
    }

    #[OA\Delete(
        path: "/api/v1/carts/{id}",
        summary: "Remover carrinho",
        tags: ["4. Carts"],
        parameters: [
            new OA\Parameter(
                name: "id",
                in: "path",
                required: true,
                description: "ID do carrinho",
                schema: new OA\Schema(type: "string", example: "uuid123")
            )
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: "Carrinho removido",
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: "message", type: "string", example: "Cart deleted")
                    ]
                )
            )
        ]
    )]
    public function destroy($id)
    {
        $this->cartService->destroy($id);

        return response()->json([
            'message' => 'Cart deleted'
        ]);
    }
}
