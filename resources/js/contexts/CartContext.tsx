"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from "react"
import api from "@/services/api"
import { Cart, CartItem, Product } from "@/types"
import { router } from "@inertiajs/react"

interface CartContextType {
    cart: Cart | null
    items: CartItem[]
    totalQuantity: number
    totalAmount: number
    isLoading: boolean
    addToCart: (product: Product, quantity?: number) => Promise<void>
    removeFromCart: (itemId: string) => Promise<void>
    updateQuantity: (itemId: string, quantity: number) => Promise<void>
    refreshCart: () => Promise<void>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [cart, setCart] = useState<Cart | null>(null)
    const [items, setItems] = useState<CartItem[]>([])
    const [isLoading, setIsLoading] = useState(false)

    const fetchCart = useCallback(async () => {
        const token = localStorage.getItem("token")
        if (!token) {
            setCart(null)
            setItems([])
            return
        }

        try {
            setIsLoading(true)
            // 1. Get or create active cart
            const cartRes = await api.get("/carts/active")
            const activeCart = cartRes.data
            setCart(activeCart)

            // 2. Get items for this cart
            const itemsRes = await api.get(`/carts/${activeCart.id}/items`)
            setItems(itemsRes.data)
        } catch (error) {
            console.error("Error fetching cart:", error)
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchCart()
    }, [fetchCart])

    const addToCart = async (product: Product, quantity: number = 1) => {
        const token = localStorage.getItem("token")
        if (!token) {
            router.get("/login")
            return
        }

        try {
            await api.post("/cart-items", {
                product_id: product.id,
                quantity
            })
            await fetchCart()
            router.get("/cart")
        } catch (error) {
            console.error("Error adding to cart:", error)
        }
    }

    const removeFromCart = async (itemId: string) => {
        try {
            await api.delete(`/cart-items/${itemId}`)
            await fetchCart()
        } catch (error) {
            console.error("Error removing from cart:", error)
        }
    }

    const updateQuantity = async (itemId: string, quantity: number) => {
        if (quantity < 1) return
        try {
            await api.put(`/cart-items/${itemId}`, { quantity })
            await fetchCart()
        } catch (error) {
            console.error("Error updating quantity:", error)
        }
    }

    const totalQuantity = items.reduce((total, item) => total + item.quantity, 0)
    const totalAmount = items.reduce((total, item) => total + (item.price * item.quantity), 0)

    return (
        <CartContext.Provider value={{
            cart,
            items,
            totalQuantity,
            totalAmount,
            isLoading,
            addToCart,
            removeFromCart,
            updateQuantity,
            refreshCart: fetchCart
        }}>
            {children}
        </CartContext.Provider>
    )
}

export const useCart = () => {
    const context = useContext(CartContext)
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider")
    }
    return context
}
