<?php

namespace App\Http\Controllers;

use OpenApi\Attributes as OA;

#[OA\Info(
    title: "E-commerce API",
    version: "1.0.0",
    description: "API completa para o sistema de E-commerce Fullstack."
)]
#[OA\Server(
    url: "/",
    description: "Servidor de Desenvolvimento"
)]
#[OA\SecurityScheme(
    securityScheme: "sanctum",
    type: "http",
    scheme: "bearer",
    bearerFormat: "JWT"
)]
abstract class Controller
{
    //
}
