<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

use OpenApi\Attributes as OA;

class EmailVerificationNotificationController extends Controller
{
    #[OA\Post(
        path: "/email/verification-notification",
        summary: "Reenviar e-mail de verificação",
        tags: ["Authentication"],
        responses: [
            new OA\Response(response: 302, description: "Redirecionamento com status do envio")
        ]
    )]
    public function store(Request $request): RedirectResponse
    {
        if ($request->user()->hasVerifiedEmail()) {
            return redirect()->intended(route('dashboard', absolute: false));
        }

        $request->user()->sendEmailVerificationNotification();

        return back()->with('status', 'verification-link-sent');
    }
}
