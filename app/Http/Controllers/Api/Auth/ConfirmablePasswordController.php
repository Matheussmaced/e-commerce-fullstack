<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use OpenApi\Attributes as OA;

class ConfirmablePasswordController extends Controller
{
    /**
     * Show the confirm password page.
     */
    public function show(): Response
    {
        return Inertia::render('auth/confirm-password');
    }

    #[OA\Post(
        path: "/confirm-password",
        summary: "Confirmar senha do usuário",
        tags: ["Authentication"],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ["password"],
                properties: [
                    new OA\Property(property: "password", type: "string", format: "password", example: "password")
                ]
            )
        ),
        responses: [
            new OA\Response(response: 302, description: "Redirecionamento após confirmação"),
            new OA\Response(response: 422, description: "Erro de validação")
        ]
    )]
    public function store(Request $request): RedirectResponse
    {
        if (! Auth::guard('web')->validate([
            'email' => $request->user()->email,
            'password' => $request->password,
        ])) {
            throw ValidationException::withMessages([
                'password' => __('auth.password'),
            ]);
        }

        $request->session()->put('auth.password_confirmed_at', time());

        return redirect()->intended(route('dashboard', absolute: false));
    }
}
