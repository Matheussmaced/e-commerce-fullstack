<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

use OpenApi\Attributes as OA;

#[OA\Tag(name: "Authentication", description: "Endpoints para autenticação de usuários")]
class AuthenticatedSessionController extends Controller
{
    /**
     * Show the login page.
     */
    public function create(Request $request): Response
    {
        return Inertia::render('auth/login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => $request->session()->get('status'),
        ]);
    }

    #[OA\Post(
        path: "/login",
        summary: "Realizar login",
        tags: ["Authentication"],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ["email", "password"],
                properties: [
                    new OA\Property(property: "email", type: "string", format: "email", example: "user@example.com"),
                    new OA\Property(property: "password", type: "string", format: "password", example: "password"),
                    new OA\Property(property: "remember", type: "boolean", example: false)
                ]
            )
        ),
        responses: [
            new OA\Response(response: 302, description: "Redirecionamento após login bem-sucedido"),
            new OA\Response(response: 422, description: "Erro de validação")
        ]
    )]
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        $request->session()->regenerate();

        return redirect()->intended(route('dashboard', absolute: false));
    }

    #[OA\Post(
        path: "/logout",
        summary: "Realizar logout",
        tags: ["Authentication"],
        responses: [
            new OA\Response(response: 302, description: "Redirecionamento após logout")
        ]
    )]
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
