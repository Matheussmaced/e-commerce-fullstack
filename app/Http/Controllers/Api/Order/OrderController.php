<?php

namespace App\Http\Controllers\Api\Order;

use App\Http\Controllers\Controller;
use App\Services\OrderService;
use OpenApi\Attributes as OA;
use Illuminate\Http\JsonResponse;

#[OA\Tag(name: "Orders", description: "Gerenciamento de pedidos do usuário")]
class OrderController extends Controller
{
    public function __construct(
        protected OrderService $orderService
    ) {}

    #[OA\Get(
        path: "/api/v1/orders",
        summary: "Listar pedidos do usuário autenticado",
        tags: ["8. Orders"],
        responses: [
            new OA\Response(
                response: 200,
                description: "Lista de pedidos",
                content: new OA\JsonContent(
                    type: "array",
                    items: new OA\Items(
                        properties: [
                            new OA\Property(property: "id", type: "string", example: "uuid-order"),
                            new OA\Property(property: "total_amount", type: "number", example: 399.80),
                            new OA\Property(property: "status", type: "string", example: "pending"),
                            new OA\Property(property: "created_at", type: "string", format: "date-time")
                        ]
                    )
                )
            )
        ]
    )]
    public function index(): JsonResponse
    {
        return response()->json(
            $this->orderService->listUserOrders()
        );
    }

    #[OA\Get(
        path: "/api/v1/orders/{id}",
        summary: "Obter detalhes de um pedido específico",
        tags: ["8. Orders"],
        parameters: [
            new OA\Parameter(
                name: "id",
                in: "path",
                required: true,
                description: "ID do pedido",
                schema: new OA\Schema(type: "string", example: "uuid-order")
            )
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: "Detalhes do pedido",
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: "id", type: "string", example: "uuid-order"),
                        new OA\Property(property: "total_amount", type: "number", example: 399.80),
                        new OA\Property(property: "status", type: "string", example: "pending"),
                        new OA\Property(
                            property: "items",
                            type: "array",
                            items: new OA\Items(
                                properties: [
                                    new OA\Property(property: "id", type: "string", example: "uuid-item"),
                                    new OA\Property(property: "product_id", type: "string", example: "uuid-product"),
                                    new OA\Property(property: "quantity", type: "integer", example: 2),
                                    new OA\Property(property: "unit_price", type: "number", example: 199.90),
                                    new OA\Property(property: "total_price", type: "number", example: 399.80),
                                    new OA\Property(
                                        property: "product",
                                        type: "object",
                                        properties: [
                                            new OA\Property(property: "name", type: "string", example: "Product Name")
                                        ]
                                    )
                                ]
                            )
                        )
                    ]
                )
            ),
            new OA\Response(
                response: 404,
                description: "Pedido não encontrado"
            )
        ]
    )]
    public function show(string $id): JsonResponse
    {
        return response()->json(
            $this->orderService->getOrderDetails($id)
        );
    }
}
