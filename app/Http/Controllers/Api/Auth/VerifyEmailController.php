<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Auth\Events\Verified;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Http\RedirectResponse;

use OpenApi\Attributes as OA;

class VerifyEmailController extends Controller
{
    #[OA\Get(
        path: "/verify-email/{id}/{hash}",
        summary: "Verificar endereço de e-mail",
        tags: ["Authentication"],
        parameters: [
            new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "string")),
            new OA\Parameter(name: "hash", in: "path", required: true, schema: new OA\Schema(type: "string"))
        ],
        responses: [
            new OA\Response(response: 302, description: "Redirecionamento após verificação")
        ]
    )]
    public function __invoke(EmailVerificationRequest $request): RedirectResponse
    {
        if ($request->user()->hasVerifiedEmail()) {
            return redirect()->intended(route('dashboard', absolute: false).'?verified=1');
        }

        if ($request->user()->markEmailAsVerified()) {
            /** @var \Illuminate\Contracts\Auth\MustVerifyEmail $user */
            $user = $request->user();

            event(new Verified($user));
        }

        return redirect()->intended(route('dashboard', absolute: false).'?verified=1');
    }
}
