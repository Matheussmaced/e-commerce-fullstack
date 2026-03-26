<?php

namespace App\Http\Controllers\Api\Address;

use App\Http\Controllers\Controller;
use App\Models\Address;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use OpenApi\Attributes as OA;

use App\Services\AddressService;
use App\Http\Requests\Address\AddressRequest;

#[OA\Tag(name: "Addresses", description: "Gerenciamento de endereço do usuário")]
class AddressController extends Controller
{
    public function __construct(
        protected AddressService $addressService
    ) {}

    #[OA\Get(
        path: "/api/v1/addresses",
        summary: "Ver endereço do usuário logado",
        tags: ["Addresses"],
        security: [["sanctum" => []]],
        responses: [
            new OA\Response(
                response: 200,
                description: "Endereço retornado com sucesso",
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: "id", type: "string", format: "uuid"),
                        new OA\Property(property: "street", type: "string"),
                        new OA\Property(property: "number", type: "integer"),
                        new OA\Property(property: "complement", type: "string", nullable: true),
                        new OA\Property(property: "neighborhood", type: "string"),
                        new OA\Property(property: "city", type: "string"),
                        new OA\Property(property: "state", type: "string"),
                        new OA\Property(property: "zip_code", type: "integer"),
                    ]
                )
            ),
            new OA\Response(response: 404, description: "Endereço não encontrado")
        ]
    )]
    public function index()
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        $address = $this->addressService->getAddress($user);

        if (!$address) {
            return response()->json(['message' => 'Address not found'], 404);
        }

        return response()->json($address);
    }

    #[OA\Post(
        path: "/api/v1/addresses",
        summary: "Criar ou atualizar endereço do usuário logado",
        tags: ["Addresses"],
        security: [["sanctum" => []]],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ["street", "number", "neighborhood", "city", "state", "zip_code"],
                properties: [
                    new OA\Property(property: "street", type: "string"),
                    new OA\Property(property: "number", type: "integer"),
                    new OA\Property(property: "complement", type: "string", nullable: true),
                    new OA\Property(property: "neighborhood", type: "string"),
                    new OA\Property(property: "city", type: "string"),
                    new OA\Property(property: "state", type: "string"),
                    new OA\Property(property: "zip_code", type: "integer"),
                ]
            )
        ),
        responses: [
            new OA\Response(response: 200, description: "Endereço salvo com sucesso"),
            new OA\Response(response: 201, description: "Endereço criado com sucesso"),
            new OA\Response(response: 422, description: "Erro de validação")
        ]
    )]
    public function store(AddressRequest $request)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        $address = $this->addressService->updateOrCreateAddress($user, $request->validated());

        return response()->json($address, $address->wasRecentlyCreated ? 201 : 200);
    }

    #[OA\Put(
        path: "/api/v1/addresses",
        summary: "Atualizar endereço do usuário logado",
        tags: ["Addresses"],
        security: [["sanctum" => []]],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: "street", type: "string"),
                    new OA\Property(property: "number", type: "integer"),
                    new OA\Property(property: "complement", type: "string", nullable: true),
                    new OA\Property(property: "neighborhood", type: "string"),
                    new OA\Property(property: "city", type: "string"),
                    new OA\Property(property: "state", type: "string"),
                    new OA\Property(property: "zip_code", type: "integer"),
                ]
            )
        ),
        responses: [
            new OA\Response(response: 200, description: "Endereço atualizado com sucesso"),
            new OA\Response(response: 404, description: "Endereço não encontrado")
        ]
    )]
    public function update(AddressRequest $request)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        $address = $this->addressService->getAddress($user);

        if (!$address) {
            return response()->json(['message' => 'Address not found'], 404);
        }

        $address = $this->addressService->updateAddress($address, $request->validated());

        return response()->json($address);
    }

    #[OA\Delete(
        path: "/api/v1/addresses",
        summary: "Deletar endereço do usuário logado",
        tags: ["Addresses"],
        security: [["sanctum" => []]],
        responses: [
            new OA\Response(response: 200, description: "Endereço deletado com sucesso"),
            new OA\Response(response: 404, description: "Endereço não encontrado")
        ]
    )]
    public function destroy()
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        $address = $this->addressService->getAddress($user);

        if (!$address) {
            return response()->json(['message' => 'Address not found'], 404);
        }

        $this->addressService->deleteAddress($address);

        return response()->json(['message' => 'Address deleted successfully']);
    }
}
