<?php

namespace App\Http\Controllers\Api\Settings;

use App\Http\Controllers\Controller;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use OpenApi\Attributes as OA;

class PasswordController extends Controller
{
    /**
     * Show the user's password settings page.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('settings/password', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => $request->session()->get('status'),
        ]);
    }

    #[OA\Put(
        path: "/password",
        summary: "Atualizar senha do usuário",
        tags: ["Profile"],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ["current_password", "password", "password_confirmation"],
                properties: [
                    new OA\Property(property: "current_password", type: "string", format: "password", example: "old-password"),
                    new OA\Property(property: "password", type: "string", format: "password", example: "new-password"),
                    new OA\Property(property: "password_confirmation", type: "string", format: "password", example: "new-password")
                ]
            )
        ),
        responses: [
            new OA\Response(response: 302, description: "Redirecionamento após atualização"),
            new OA\Response(response: 422, description: "Erro de validação")
        ]
    )]
    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'current_password' => ['required', 'current_password'],
            'password' => ['required', Password::defaults(), 'confirmed'],
        ]);

        $request->user()->update([
            'password' => Hash::make($validated['password']),
        ]);

        return back();
    }
}
