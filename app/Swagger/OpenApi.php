<?php

namespace App\Swagger;

use OpenApi\Attributes as OA;

#[OA\Info(title: "Mini Ecommerce API", version: "1.0.0", description: "API do Mini Ecommerce")]
#[OA\Server(url: "http://localhost:8000", description: "Servidor Local")]
#[OA\Tag(name: "1. Authentication", description: "Endpoints para autenticação de usuários")]
#[OA\Tag(name: "2. Categories", description: "Gerenciamento de categorias")]
#[OA\Tag(name: "3. Products", description: "Gerenciamento de produtos")]
#[OA\Tag(name: "4. Carts", description: "Gerenciamento de carrinhos")]
#[OA\Tag(name: "5. Users", description: "Gerenciamento de usuários")]
class OpenApi {}
