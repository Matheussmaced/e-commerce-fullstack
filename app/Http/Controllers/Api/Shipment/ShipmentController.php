<?php

namespace App\Http\Controllers\Api\Shipment;

use App\Http\Controllers\Controller;
use App\Services\ShipmentService;
use Illuminate\Http\Request;
use OpenApi\Attributes as OA;

class ShipmentController extends Controller
{
    public function __construct(
        protected ShipmentService $shipmentService
    ) {}

    #[OA\Get(
        path: "/api/v1/shipments/{order_id}",
        summary: "Ver detalhes de envio por ID do pedido",
        tags: ["Shipments"],
        security: [["sanctum" => []]],
        parameters: [
            new OA\Parameter(
                name: "order_id",
                in: "path",
                required: true,
                description: "UUID do pedido",
                schema: new OA\Schema(type: "string", format: "uuid")
            )
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: "Envio retornado com sucesso",
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: "id", type: "string", format: "uuid"),
                        new OA\Property(property: "order_id", type: "string", format: "uuid"),
                        new OA\Property(property: "shipping_cost", type: "number", format: "float"),
                        new OA\Property(property: "status", type: "string"),
                        new OA\Property(property: "tracking_code", type: "string", nullable: true)
                    ]
                )
            ),
            new OA\Response(response: 404, description: "Envio não encontrado")
        ]
    )]
    public function show(string $orderId)
    {
        $shipment = $this->shipmentService->getShipmentByOrder($orderId);

        if (!$shipment) {
            return response()->json(['message' => 'Shipment not found'], 404);
        }

        return response()->json($shipment);
    }

    #[OA\Patch(
        path: "/api/v1/shipments/{id}",
        summary: "Atualizar status ou código de rastreio (Admin Only)",
        tags: ["Shipments"],
        security: [["sanctum" => []]],
        parameters: [
            new OA\Parameter(
                name: "id",
                in: "path",
                required: true,
                description: "UUID do envio",
                schema: new OA\Schema(type: "string", format: "uuid")
            )
        ],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: "status", type: "string", example: "shipped"),
                    new OA\Property(property: "tracking_code", type: "string", example: "ABC123456789")
                ]
            )
        ),
        responses: [
            new OA\Response(response: 200, description: "Envio atualizado com sucesso"),
            new OA\Response(response: 403, description: "Acesso negado"),
            new OA\Response(response: 404, description: "Envio não encontrado")
        ]
    )]
    public function update(Request $request, string $id)
    {
        // Check if user is admin
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Admin only'], 403);
        }

        $validated = $request->validate([
            'status' => 'sometimes|string|in:preparing,shipped,delivered,cancelled',
            'tracking_code' => 'sometimes|string|max:255',
        ]);

        $shipment = $this->shipmentService->updateShipment($id, $validated);

        return response()->json($shipment);
    }
}
