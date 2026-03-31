import React, { useState } from "react";
import AppLayout from "@/layouts/AppLayout";
import { useCart } from "@/contexts/CartContext";
import { Minus, Plus, Trash2, ShoppingBag, CreditCard, Banknote, QrCode, MapPin } from "lucide-react";
import { Link, router } from "@inertiajs/react";
import api from "@/services/api";

export default function Cart() {
  const { cart, items, totalAmount, updateQuantity, removeFromCart, isLoading, refreshCart } = useCart();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [address, setAddress] = useState({
    zip_code: "",
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: ""
  });

  const isAddressValid = Boolean(
    address.zip_code && 
    address.street && 
    address.number && 
    address.neighborhood && 
    address.city && 
    address.state
  );

  const handleCheckout = async () => {
    if (!selectedPaymentMethod || !cart) return;

    try {
      setIsProcessing(true);

      // 1. Criar o pedido (Checkout)
      const checkoutRes = await api.post("/checkout", {
        cart_id: cart.id,
        address
      });

      const order = checkoutRes.data;

      // 2. Processar o pagamento
      await api.post("/payments", {
        order_id: order.id,
        payment_method: selectedPaymentMethod
      });

      // 3. Sucesso!
      await refreshCart(); // Limpar carrinho local
      router.get(`/checkout/success?order_id=${order.id}`);

    } catch (error: any) {
      console.error("Erro ao finalizar checkout:", error);
      const errorMessage = error.response?.data?.message || "Erro ao processar sua compra. Por favor, tente novamente.";
      alert(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const paymentMethods = [
    { id: "pix", name: "Pix", icon: QrCode },
    { id: "credit_card", name: "Cartão de Crédito", icon: CreditCard },
    { id: "boleto", name: "Boleto", icon: Banknote },
  ];

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
              <div className="space-y-8">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-6 pb-8 border-b border-zinc-100 last:border-0 font-sans">
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

              {/* ENDEREÇO DE ENTREGA */}
              <div className="pt-8 border-t border-zinc-100">
                <div className="flex items-center gap-3 mb-6">
                  <MapPin className="text-black" />
                  <h2 className="text-2xl font-bold text-black font-sans">Endereço de Entrega</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-zinc-500 uppercase">CEP</label>
                    <input 
                      type="text" 
                      value={address.zip_code}
                      onChange={e => setAddress({...address, zip_code: e.target.value})}
                      className="w-full mt-1 px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:border-black outline-none transition text-black" 
                      placeholder="00000-000"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase">Rua</label>
                    <input 
                      type="text" 
                      value={address.street}
                      onChange={e => setAddress({...address, street: e.target.value})}
                      className="w-full mt-1 px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:border-black outline-none transition text-black" 
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-zinc-500 uppercase">Número</label>
                    <input 
                      type="text" 
                      value={address.number}
                      onChange={e => setAddress({...address, number: e.target.value})}
                      className="w-full mt-1 px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:border-black outline-none transition text-black" 
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-zinc-500 uppercase">Complemento (Opcional)</label>
                    <input 
                      type="text" 
                      value={address.complement}
                      onChange={e => setAddress({...address, complement: e.target.value})}
                      className="w-full mt-1 px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:border-black outline-none transition text-black" 
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-zinc-500 uppercase">Bairro</label>
                    <input 
                      type="text" 
                      value={address.neighborhood}
                      onChange={e => setAddress({...address, neighborhood: e.target.value})}
                      className="w-full mt-1 px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:border-black outline-none transition text-black" 
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-zinc-500 uppercase">Cidade</label>
                    <input 
                      type="text" 
                      value={address.city}
                      onChange={e => setAddress({...address, city: e.target.value})}
                      className="w-full mt-1 px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:border-black outline-none transition text-black" 
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-zinc-500 uppercase">Estado (UF)</label>
                    <input 
                      type="text" 
                      value={address.state}
                      maxLength={2}
                      onChange={e => setAddress({...address, state: e.target.value.toUpperCase()})}
                      className="w-full mt-1 px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:border-black outline-none transition uppercase text-black" 
                      placeholder="SP"
                    />
                  </div>
                </div>
              </div>

              {/* MÉTODOS DE PAGAMENTO */}
              <div className="pt-8 border-t border-zinc-100">
                <h2 className="text-2xl font-bold text-black mb-6">Método de Pagamento</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {paymentMethods.map((method) => {
                    const Icon = method.icon;
                    return (
                      <button
                        key={method.id}
                        onClick={() => setSelectedPaymentMethod(method.id)}
                        className={`
                          flex items-center gap-4 p-4 rounded-2xl border-2 transition cursor-pointer
                          ${selectedPaymentMethod === method.id
                            ? "border-black bg-black text-white"
                            : "border-zinc-100 bg-white text-zinc-600 hover:border-zinc-300"
                          }
                        `}
                      >
                        <div className={`p-2 rounded-lg ${selectedPaymentMethod === method.id ? "bg-white/20" : "bg-zinc-100"}`}>
                          <Icon size={20} />
                        </div>
                        <span className="font-bold text-sm tracking-tight">{method.name}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Resumo */}
            <div className="lg:col-span-1">
              <div className="bg-zinc-50 rounded-3xl p-8 sticky top-32">
                <h2 className="text-2xl font-bold text-black mb-6 font-sans">Resumo</h2>

                <div className="space-y-4 mb-8 font-sans">
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

                <button
                  onClick={handleCheckout}
                  disabled={!selectedPaymentMethod || !isAddressValid || isProcessing}
                  className={`
                    w-full py-4 rounded-2xl transition duration-300 font-bold text-lg cursor-pointer
                    ${!selectedPaymentMethod || !isAddressValid || isProcessing
                      ? "bg-zinc-200 text-zinc-400 cursor-not-allowed"
                      : "bg-black text-white hover:bg-zinc-800 shadow-xl shadow-black/10"
                    }
                  `}
                >
                  {isProcessing ? "Processando..." : "Finalizar Compra"}
                </button>

                {(!selectedPaymentMethod || !isAddressValid) && (
                  <p className="text-[10px] text-zinc-400 text-center mt-3 uppercase font-bold tracking-widest">
                    {!isAddressValid ? "Preencha o endereço completo" : "Selecione um pagamento"}
                  </p>
                )}

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