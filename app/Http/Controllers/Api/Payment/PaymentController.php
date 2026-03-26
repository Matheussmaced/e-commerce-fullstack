<?php

namespace App\Http\Controllers\Api\Payment;

use App\Http\Controllers\Controller;
use App\Http\Requests\Payment\StorePaymentRequest;
use App\Services\PaymentService;
use OpenApi\Attributes as OA;
use Exception;

#[OA\Tag(name: "Payments", description: "Processamento de pagamentos")]
class PaymentController extends Controller
{
    public function __construct(
        protected PaymentService $paymentService
    ) {}

    #[OA\Post(
        path: "/api/v1/payments",
        summary: "Processar pagamento de um pedido",
        tags: ["Payments"],
        security: [["sanctum" => []]],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ["order_id", "payment_method"],
                properties: [
                    new OA\Property(property: "order_id", type: "string", example: "uuid-order"),
                    new OA\Property(property: "payment_method", type: "string", example: "pix")
                ]
            )
        ),
        responses: [
            new OA\Response(
                response: 201,
                description: "Pagamento processado com sucesso",
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: "id", type: "string", example: "uuid-payment"),
                        new OA\Property(property: "order_id", type: "string", example: "uuid-order"),
                        new OA\Property(property: "amount", type: "number", example: 399.80),
                        new OA\Property(property: "payment_method", type: "string", example: "pix"),
                        new OA\Property(property: "status", type: "string", example: "paid"),
                        new OA\Property(property: "transaction_id", type: "string", example: "TXN-123456")
                    ]
                )
            ),
            new OA\Response(
                response: 400,
                description: "Erro no processamento do pagamento"
            )
        ]
    )]
    public function store(StorePaymentRequest $request)
    {
        try {
            $payment = $this->paymentService->processPayment($request->validated());
            return response()->json($payment, 201);
        } catch (Exception $e) {
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }
}
