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
#[OA\Tag(name: "Authentication", description: "Autenticação de usuários")]
#[OA\Tag(name: "Categories", description: "Gerenciamento de categorias")]
#[OA\Tag(name: "Products", description: "Gerenciamento de produtos")]
#[OA\Tag(name: "Carts", description: "Gerenciamento de carrinhos")]
#[OA\Tag(name: "Cart Items", description: "Itens do carrinho")]
#[OA\Tag(name: "Checkout", description: "Finalização de compra")]
#[OA\Tag(name: "Orders", description: "Gerenciamento de pedidos")]
#[OA\Tag(name: "Order Items", description: "Itens do pedido")]
#[OA\Tag(name: "Payments", description: "Pagamentos")]
#[OA\Tag(name: "Shipments", description: "Gerenciamento de envios")]
#[OA\Tag(name: "Addresses", description: "Gerenciamento de endereços")]
#[OA\Tag(name: "Users", description: "Gerenciamento de usuários")]
abstract class Controller
{
    //
}
