<?php

namespace App\Http\Controllers\Api\Checkout;

use App\Http\Controllers\Controller;
use App\Http\Requests\Checkout\CheckoutRequest;
use App\Services\CheckoutService;
use OpenApi\Attributes as OA;
use Exception;

#[OA\Tag(name: "Checkout", description: "Processamento de pedidos")]
class CheckoutController extends Controller
{
    public function __construct(
        protected CheckoutService $checkoutService
    ) {}

    #[OA\Post(
        path: "/api/v1/checkout",
        summary: "Finalizar checkout do carrinho",
        tags: ["7. Checkout"],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ["cart_id"],
                properties: [
                    new OA\Property(property: "cart_id", type: "string", example: "uuid-cart")
                ]
            )
        ),
        responses: [
            new OA\Response(
                response: 201,
                description: "Pedido criado com sucesso",
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
                                    new OA\Property(property: "product_id", type: "string", example: "uuid-product"),
                                    new OA\Property(property: "quantity", type: "integer", example: 2),
                                    new OA\Property(property: "unit_price", type: "number", example: 199.90),
                                    new OA\Property(property: "total_price", type: "number", example: 399.80)
                                ]
                            )
                        )
                    ]
                )
            ),
            new OA\Response(
                response: 400,
                description: "Erro no processamento do checkout",
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: "message", type: "string", example: "Cart is empty")
                    ]
                )
            ),
            new OA\Response(
                response: 422,
                description: "Erro de validação",
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: "message", type: "string", example: "The selected cart id is invalid.")
                    ]
                )
            )
        ]
    )]
    public function store(CheckoutRequest $request)
    {
        try {
            $order = $this->checkoutService->processCheckout(
                $request->validated()['cart_id']
            );

            return response()->json($order, 201);
        } catch (Exception $e) {
            return response()->json([
                'message' => $e->getMessage()
            ], 400);
        }
    }
}
