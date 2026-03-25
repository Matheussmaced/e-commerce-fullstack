<?php

namespace App\Http\Controllers\Api\OrderItem;

use App\Http\Controllers\Controller;
use App\Services\OrderItemService;
use OpenApi\Attributes as OA;
use Illuminate\Http\JsonResponse;

#[OA\Tag(name: "Order Items", description: "Gerenciamento de itens de pedidos")]
class OrderItemController extends Controller
{
    public function __construct(
        protected OrderItemService $orderItemService
    ) {}

    #[OA\Get(
        path: "/api/v1/orders/{order_id}/items",
        summary: "Listar itens de um pedido específico",
        tags: ["9. Order Items"],
        security: [["sanctum" => []]],
        parameters: [
            new OA\Parameter(
                name: "order_id",
                in: "path",
                required: true,
                description: "ID do pedido",
                schema: new OA\Schema(type: "string", example: "uuid-order")
            )
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: "Lista de itens do pedido",
                content: new OA\JsonContent(
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
            ),
            new OA\Response(
                response: 404,
                description: "Pedido não encontrado"
            )
        ]
    )]
    public function index(string $order_id): JsonResponse
    {
        return response()->json(
            $this->orderItemService->getItemsByOrder($order_id)
        );
    }
}
