<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

use OpenApi\Attributes as OA;

class EmailVerificationPromptController extends Controller
{
    #[OA\Get(
        path: "/verify-email",
        summary: "Mostrar aviso de verificação de e-mail",
        tags: ["Authentication"],
        responses: [
            new OA\Response(response: 200, description: "Página de aviso"),
            new OA\Response(response: 302, description: "Redirecionamento se já verificado")
        ]
    )]
    public function __invoke(Request $request): Response|RedirectResponse
    {
        return $request->user()->hasVerifiedEmail()
                    ? redirect()->intended(route('dashboard', absolute: false))
                    : Inertia::render('auth/verify-email', ['status' => $request->session()->get('status')]);
    }
}
