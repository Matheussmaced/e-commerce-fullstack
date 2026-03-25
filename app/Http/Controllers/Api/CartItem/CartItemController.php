<?php

namespace App\Http\Controllers\Api\CartItem;

use App\Http\Controllers\Controller;
use App\Http\Requests\CartItem\StoreCartItemRequest;
use App\Http\Requests\CartItem\UpdateCartItemRequest;
use App\Services\CartItemService;
use OpenApi\Attributes as OA;

#[OA\Tag(name: "Cart Items", description: "Gerenciamento de itens do carrinho")]
class CartItemController extends Controller
{
    public function __construct(
        protected CartItemService $cartItemService
    ) {}

    #[OA\Get(
        path: "/api/v1/carts/{cart_id}/items",
        summary: "Listar itens do carrinho",
        tags: ["6. Cart Items"],
        parameters: [
            new OA\Parameter(
                name: "cart_id",
                in: "path",
                required: true,
                description: "ID do carrinho",
                schema: new OA\Schema(type: "string", example: "uuid-cart")
            )
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: "Lista de itens do carrinho",
                content: new OA\JsonContent(
                    type: "array",
                    items: new OA\Items(
                        properties: [
                            new OA\Property(property: "id", type: "string", example: "uuid-item"),
                            new OA\Property(property: "product_id", type: "string", example: "uuid-product"),
                            new OA\Property(property: "quantity", type: "integer", example: 2),
                            new OA\Property(property: "price", type: "number", example: 199.90)
                        ]
                    )
                )
            )
        ]
    )]
    public function index($cart_id)
    {
        return response()->json(
            $this->cartItemService->getByCart($cart_id)
        );
    }

    #[OA\Post(
        path: "/api/v1/cart-items",
        summary: "Adicionar item ao carrinho",
        tags: ["6. Cart Items"],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ["cart_id", "product_id", "quantity"],
                properties: [
                    new OA\Property(property: "cart_id", type: "string", example: "uuid-cart"),
                    new OA\Property(property: "product_id", type: "string", example: "uuid-product"),
                    new OA\Property(property: "quantity", type: "integer", example: 1)
                ]
            )
        ),
        responses: [
            new OA\Response(
                response: 201,
                description: "Item adicionado ao carrinho",
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: "id", type: "string", example: "uuid-item"),
                        new OA\Property(property: "cart_id", type: "string", example: "uuid-cart"),
                        new OA\Property(property: "product_id", type: "string", example: "uuid-product"),
                        new OA\Property(property: "quantity", type: "integer", example: 1),
                        new OA\Property(property: "price", type: "number", example: 199.90)
                    ]
                )
            )
        ]
    )]
    public function store(StoreCartItemRequest $request)
    {
        $item = $this->cartItemService->create(
            $request->validated()
        );

        return response()->json($item, 201);
    }

    #[OA\Put(
        path: "/api/v1/cart-items/{id}",
        summary: "Atualizar quantidade do item",
        tags: ["6. Cart Items"],
        parameters: [
            new OA\Parameter(
                name: "id",
                in: "path",
                required: true,
                description: "ID do item do carrinho",
                schema: new OA\Schema(type: "string", example: "uuid-item")
            )
        ],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: "quantity", type: "integer", example: 3)
                ]
            )
        ),
        responses: [
            new OA\Response(
                response: 200,
                description: "Item atualizado",
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: "id", type: "string", example: "uuid-item"),
                        new OA\Property(property: "quantity", type: "integer", example: 3)
                    ]
                )
            )
        ]
    )]
    public function update($id, UpdateCartItemRequest $request)
    {
        return response()->json(
            $this->cartItemService->update($id, $request->validated())
        );
    }

    #[OA\Delete(
        path: "/api/v1/cart-items/{id}",
        summary: "Remover item do carrinho",
        tags: ["6. Cart Items"],
        parameters: [
            new OA\Parameter(
                name: "id",
                in: "path",
                required: true,
                description: "ID do item",
                schema: new OA\Schema(type: "string", example: "uuid-item")
            )
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: "Item removido",
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: "message", type: "string", example: "Item removed from cart")
                    ]
                )
            )
        ]
    )]
    public function destroy($id)
    {
        $this->cartItemService->delete($id);

        return response()->json([
            'message' => 'Item removed from cart'
        ]);
    }
}
