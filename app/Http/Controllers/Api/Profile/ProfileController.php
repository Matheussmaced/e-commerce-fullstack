<?php

namespace App\Http\Controllers\Api\Profile;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Profile\ProfileUpdateRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use OpenApi\Attributes as OA;

#[OA\Tag(name: "Profile", description: "Gerenciamento do perfil do usuário logado")]
class ProfileController extends Controller
{
    #[OA\Get(
        path: "/api/v1/me",
        summary: "Ver perfil do usuário logado",
        tags: ["Profile"],
        security: [["sanctum" => []]],
        responses: [
            new OA\Response(
                response: 200,
                description: "Dados do perfil",
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: "id", type: "string", format: "uuid"),
                        new OA\Property(property: "name", type: "string", example: "John Doe"),
                        new OA\Property(property: "email", type: "string", format: "email", example: "john@example.com"),
                        new OA\Property(property: "role", type: "string", example: "user")
                    ]
                )
            ),
            new OA\Response(response: 401, description: "Não autenticado")
        ]
    )]
    public function show(Request $request)
    {
        return response()->json($request->user()->only(['id', 'name', 'email', 'role']));
    }

    #[OA\Put(
        path: "/api/v1/me",
        summary: "Atualizar perfil do usuário logado",
        tags: ["Profile"],
        security: [["sanctum" => []]],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ["name", "email"],
                properties: [
                    new OA\Property(property: "name", type: "string", example: "John Doe Updated"),
                    new OA\Property(property: "email", type: "string", format: "email", example: "john_updated@example.com"),
                    new OA\Property(property: "password", type: "string", format: "password", example: "newpassword123"),
                    new OA\Property(property: "password_confirmation", type: "string", format: "password", example: "newpassword123")
                ]
            )
        ),
        responses: [
            new OA\Response(
                response: 200,
                description: "Perfil atualizado com sucesso",
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: "message", type: "string", example: "Profile updated successfully"),
                        new OA\Property(property: "user", type: "object")
                    ]
                )
            ),
            new OA\Response(response: 422, description: "Erro de validação")
        ]
    )]
    public function update(ProfileUpdateRequest $request)
    {
        $user = $request->user();
        
        $user->fill($request->safe()->only(['name', 'email']));

        if ($request->filled('password')) {
            $user->password = Hash::make($request->password);
        }

        $user->save();

        return response()->json([
            'message' => 'Profile updated successfully',
            'user' => $user->only(['id', 'name', 'email', 'role'])
        ]);
    }

    #[OA\Delete(
        path: "/api/v1/me",
        summary: "Excluir conta do usuário logado",
        tags: ["Profile"],
        security: [["sanctum" => []]],
        responses: [
            new OA\Response(
                response: 200,
                description: "Conta excluída com sucesso",
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: "message", type: "string", example: "Account deleted successfully")
                    ]
                )
            ),
            new OA\Response(response: 401, description: "Não autenticado")
        ]
    )]
    public function destroy(Request $request)
    {
        $user = $request->user();
        
        $user->tokens()->delete();
        $user->delete();

        return response()->json([
            'message' => 'Account deleted successfully'
        ]);
    }
}
