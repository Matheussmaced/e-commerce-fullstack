"use client"

import AppLayout from "@/layouts/AppLayout";
import { useCart } from "@/contexts/CartContext";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { Link } from "@inertiajs/react";

export default function Cart() {
  const { items, totalAmount, updateQuantity, removeFromCart, isLoading } = useCart();

  if (isLoading) {
    return (
      <AppLayout>
        <div className="pt-32 px-6 max-w-7xl mx-auto flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-black mb-12">Seu Carrinho</h1>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 bg-zinc-100 rounded-full flex items-center justify-center mb-6">
              <ShoppingBag size={32} className="text-zinc-400" />
            </div>
            <h2 className="text-xl font-medium text-black mb-2">Ops! Seu carrinho está vazio</h2>
            <p className="text-zinc-500 mb-8 max-w-xs">
              Parece que você ainda não adicionou nenhum produto ao seu carrinho.
            </p>
            <Link
              href="/products"
              className="bg-black text-white px-8 py-3 rounded-full hover:bg-zinc-800 transition duration-300 font-medium"
            >
              Explorar Produtos
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Lista de Itens */}
            <div className="lg:col-span-2 space-y-8">
              {items.map((item) => (
                <div key={item.id} className="flex gap-6 pb-8 border-b border-zinc-100 last:border-0">
                  <div className="w-24 h-32 bg-zinc-100 rounded-xl overflow-hidden flex-shrink-0">
                    <img
                      src={item.product.image || "https://picsum.photos/200/300"}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-lg text-black">{item.product.name}</h3>
                        <p className="text-sm text-zinc-500">{item.product.category?.name || "Produto"}</p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-zinc-400 hover:text-red-500 transition cursor-pointer"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>

                    <div className="flex justify-between items-end mt-4">
                      <div className="flex items-center gap-4 bg-zinc-100 px-4 py-2 rounded-full">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="text-zinc-600 hover:text-black transition cursor-pointer"
                          disabled={item.quantity <= 1}
                        >
                          <Minus size={18} />
                        </button>
                        <span className="font-bold text-black min-w-[20px] text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="text-zinc-600 hover:text-black transition cursor-pointer"
                        >
                          <Plus size={18} />
                        </button>
                      </div>
                      <p className="font-bold text-xl text-black">
                        R$ {(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Resumo */}
            <div className="lg:col-span-1">
              <div className="bg-zinc-50 rounded-3xl p-8 sticky top-32">
                <h2 className="text-2xl font-bold text-black mb-6">Resumo</h2>

                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-zinc-500">
                    <span>Subtotal</span>
                    <span>R$ {totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-zinc-500">
                    <span>Entrega</span>
                    <span className="text-green-600 font-medium">Grátis</span>
                  </div>
                  <div className="pt-4 border-t border-zinc-200 flex justify-between text-black font-bold text-xl">
                    <span>Total</span>
                    <span>R$ {totalAmount.toFixed(2)}</span>
                  </div>
                </div>

                <button className="w-full bg-black text-white py-4 rounded-2xl hover:bg-zinc-800 transition duration-300 font-bold text-lg cursor-pointer">
                  Finalizar Compra
                </button>

                <Link
                  href="/products"
                  className="block text-center mt-6 text-zinc-500 hover:text-black transition text-sm font-medium"
                >
                  Continuar Comprando
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}