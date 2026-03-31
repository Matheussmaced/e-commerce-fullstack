<?php

namespace App\Services;

use App\Repositories\CartRepository;

class CartService
{
    protected $cartRepository;

    public function __construct(CartRepository $cartRepository)
    {
        $this->cartRepository = $cartRepository;
    }

    public function index($userId = null)
    {
        return $this->cartRepository->getAll($userId);
    }

    public function findOrCreateActive($userId)
    {
        $cart = $this->cartRepository->findActiveByUser($userId);

        if (!$cart) {
            $cart = $this->cartRepository->create([
                'user_id' => $userId,
                'status' => 'active'
            ]);
        }

        return $cart;
    }

    public function show($id)
    {
        return $this->cartRepository->findById($id);
    }

    public function store(array $data)
    {
        return $this->cartRepository->create($data);
    }

    public function destroy($id)
    {
        return $this->cartRepository->delete($id);
    }
}
