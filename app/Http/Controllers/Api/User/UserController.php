<?php

namespace App\Http\Controllers\Api\User;

use App\Http\Controllers\Controller;
use App\Models\User;
use OpenApi\Attributes as OA;

#[OA\Tag(name: "Users", description: "Gerenciamento de usuários")]
class UserController extends Controller
{

    #[OA\Get(
        path: "/api/v1/users",
        summary: "Listar usuários",
        tags: ["Users"],
        security: [["sanctum" => []]],
        responses: [
            new OA\Response(
                response: 200,
                description: "Lista de usuários",
                content: new OA\JsonContent(
                    type: "array",
                    items: new OA\Items(
                        properties: [
                            new OA\Property(property: "id", type: "string", format: "uuid", example: "9b2c3e1a-8f72-4b0e-9c7e-5d8a9f0c3a21"),
                            new OA\Property(property: "name", type: "string", example: "Matheus"),
                            new OA\Property(property: "email", type: "string", example: "matheus@email.com"),
                            new OA\Property(property: "created_at", type: "string", example: "2026-03-25T12:00:00")
                        ]
                    )
                )
            )
        ]
    )]
    public function index()
    {
        $users = User::select(
            'id',
            'name',
            'email',
            'role',
            'created_at'
        )->get();

        return response()->json($users);
    }


    #[OA\Get(
        path: "/api/v1/users/{id}",
        summary: "Buscar usuário por ID",
        tags: ["Users"],
        security: [["sanctum" => []]],
        parameters: [
            new OA\Parameter(
                name: "id",
                in: "path",
                required: true,
                description: "ID do usuário",
                schema: new OA\Schema(type: "string", format: "uuid", example: "9b2c3e1a-8f72-4b0e-9c7e-5d8a9f0c3a21")
            )
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: "Usuário encontrado",
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: "id", type: "string", format: "uuid", example: "9b2c3e1a-8f72-4b0e-9c7e-5d8a9f0c3a21"),
                        new OA\Property(property: "name", type: "string", example: "Matheus"),
                        new OA\Property(property: "email", type: "string", example: "matheus@email.com"),
                        new OA\Property(property: "created_at", type: "string", example: "2026-03-25T12:00:00")
                    ]
                )
            ),
            new OA\Response(
                response: 404,
                description: "Usuário não encontrado"
            )
        ]
    )]
    public function show($id)
    {
        $user = User::select(
            'id',
            'name',
            'email',
            'created_at'
        )->findOrFail($id);

        return response()->json($user);
    }

    #[OA\Delete(
        path: "/api/v1/users/{id}",
        summary: "Excluir um usuário",
        tags: ["Users"],
        security: [["sanctum" => []]],
        parameters: [
            new OA\Parameter(
                name: "id",
                in: "path",
                required: true,
                description: "ID do usuário",
                schema: new OA\Schema(type: "string", format: "uuid")
            )
        ],
        responses: [
            new OA\Response(response: 200, description: "Usuário excluído com sucesso"),
            new OA\Response(response: 404, description: "Usuário não encontrado")
        ]
    )]
    public function destroy(string $id)
    {
        $user = User::findOrFail($id);

        if (auth()->id() === $user->id) {
            return response()->json(['message' => 'Você não pode excluir sua própria conta.'], 403);
        }

        $user->delete();

        return response()->json(['message' => 'Usuário excluído com sucesso.']);
    }
}
