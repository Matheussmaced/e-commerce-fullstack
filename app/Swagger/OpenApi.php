<?php

namespace App\Swagger;

use OpenApi\Attributes as OA;

#[OA\Info(title: "Mini Ecommerce API", version: "1.0.0", description: "API do Mini Ecommerce")]
#[OA\Server(url: "http://localhost:8000", description: "Servidor Local")]
class OpenApi {}
