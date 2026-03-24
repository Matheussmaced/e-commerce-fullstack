<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use OpenApi\Attributes as OA;

class PasswordResetLinkController extends Controller
{
    /**
     * Show the password reset link request page.
     */
    public function create(Request $request): Response
    {
        return Inertia::render('auth/forgot-password', [
            'status' => $request->session()->get('status'),
        ]);
    }

    #[OA\Post(
        path: "/forgot-password",
        summary: "Solicitar link de redefinição de senha",
        tags: ["Authentication"],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ["email"],
                properties: [
                    new OA\Property(property: "email", type: "string", format: "email", example: "user@example.com")
                ]
            )
        ),
        responses: [
            new OA\Response(response: 302, description: "Redirecionamento com mensagem de status"),
            new OA\Response(response: 422, description: "Erro de validação")
        ]
    )]
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        Password::sendResetLink(
            $request->only('email')
        );

        return back()->with('status', __('A reset link will be sent if the account exists.'));
    }
}
