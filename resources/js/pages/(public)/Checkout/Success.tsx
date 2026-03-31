import React from "react"
import AppLayout from "@/layouts/AppLayout"
import { CheckCircle, Package, ArrowRight, ShoppingBag } from "lucide-react"
import { Link, usePage } from "@inertiajs/react"

export default function Success() {
  const { url } = usePage()
  const searchParams = new URLSearchParams(url.split("?")[1])
  const orderId = searchParams.get("order_id")

  return (
    <AppLayout>
      <div className="pt-32 pb-20 px-6 max-w-3xl mx-auto text-center">
        <div className="flex justify-center mb-8">
          <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center animate-bounce">
            <CheckCircle size={48} />
          </div>
        </div>

        <h1 className="text-4xl font-bold text-black mb-4">Pedido Realizado com Sucesso!</h1>
        <p className="text-zinc-500 text-lg mb-12">
          Obrigado por sua compra. Seu pedido foi recebido e está sendo processado.
        </p>

        <div className="bg-zinc-50 rounded-3xl p-8 mb-12 text-left border border-zinc-100">
          <div className="flex items-center justify-between mb-6">
            <span className="text-zinc-400 font-bold uppercase tracking-widest text-xs">ID do Pedido</span>
            <span className="text-black font-mono font-medium truncate ml-4">{orderId}</span>
          </div>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center flex-shrink-0">
                <Package size={20} />
              </div>
              <div>
                <h3 className="font-bold text-black">Acompanhe seu envio</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">
                  Você pode rastrear o status de entrega do seu pedido em tempo real através da nossa página de rastreamento.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href={`/shipments/tracking/${orderId}`}
            className="flex items-center justify-center gap-2 bg-black text-white px-8 py-4 rounded-2xl hover:bg-zinc-800 transition duration-300 font-bold"
          >
            Rastrear Pedido
            <ArrowRight size={20} />
          </Link>
          <Link
            href="/orders"
            className="flex items-center justify-center gap-2 bg-white text-black border border-zinc-200 px-8 py-4 rounded-2xl hover:bg-zinc-50 transition duration-300 font-bold"
          >
            <ShoppingBag size={20} />
            Ver Meus Pedidos
          </Link>
        </div>
      </div>
    </AppLayout>
  )
}
