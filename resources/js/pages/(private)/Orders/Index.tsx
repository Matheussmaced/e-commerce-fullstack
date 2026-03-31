import React, { useEffect, useState } from "react";
import AppLayout from "@/layouts/AppLayout";
import { Package, ArrowRight, Clock, CheckCircle, Truck, XCircle } from "lucide-react";
import { Link } from "@inertiajs/react";
import api from "@/services/api";

type Order = {
  id: string;
  total_amount: number;
  status: string;
  created_at: string;
};

export default function OrdersIndex() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const res = await api.get("/orders");
      setOrders(res.data);
    } catch (error) {
      console.error("Erro ao buscar pedidos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const currentStatusConfig = (status: string) => {
    switch (status) {
      case "pending":
        return { icon: Clock, color: "text-amber-500", bg: "bg-amber-100", label: "Aguardando Pagamento" };
      case "paid":
        return { icon: CheckCircle, color: "text-emerald-500", bg: "bg-emerald-100", label: "Pagamento Aprovado" };
      case "shipped":
        return { icon: Truck, color: "text-blue-500", bg: "bg-blue-100", label: "Em Trânsito" };
      case "delivered":
        return { icon: Package, color: "text-zinc-600", bg: "bg-zinc-200", label: "Entregue" };
      case "canceled":
        return { icon: XCircle, color: "text-red-500", bg: "bg-red-100", label: "Cancelado" };
      default:
        return { icon: Package, color: "text-zinc-500", bg: "bg-zinc-100", label: "Processando" };
    }
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="pt-32 px-6 max-w-5xl mx-auto flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="pt-32 pb-20 px-6 max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-black mb-12">Meus Pedidos</h1>

        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-zinc-50 rounded-3xl border border-zinc-100">
            <div className="w-20 h-20 bg-white shadow-sm rounded-full flex items-center justify-center mb-6">
              <Package size={32} className="text-zinc-400" />
            </div>
            <h2 className="text-xl font-medium text-black mb-2">Você ainda não fez nenhuma compra</h2>
            <p className="text-zinc-500 mb-8 max-w-sm">
              Quando você realizar pedidos, eles aparecerão aqui para que você possa acompanhar o status.
            </p>
            <Link
              href="/products"
              className="bg-black text-white px-8 py-3 rounded-full hover:bg-zinc-800 transition duration-300 font-medium"
            >
              Explorar Produtos
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const statusConfig = currentStatusConfig(order.status);
              const StatusIcon = statusConfig.icon;
              
              return (
                <div key={order.id} className="bg-white border border-zinc-100 hover:border-zinc-300 rounded-3xl p-6 sm:p-8 transition-colors duration-300 shadow-sm flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">
                  <div className="flex flex-col flex-1 gap-4 w-full">
                    <div className="flex justify-between items-start w-full">
                      <div>
                        <span className="text-xs uppercase tracking-widest font-bold text-zinc-400 block mb-1">
                          Pedido
                        </span>
                        <p className="font-mono text-black font-medium">{order.id.split('-')[0].toUpperCase()}...{order.id.split('-').pop()?.substring(0,4)}</p>
                      </div>
                      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${statusConfig.bg}`}>
                        <StatusIcon size={14} className={statusConfig.color} />
                        <span className={`text-xs font-bold ${statusConfig.color}`}>{statusConfig.label}</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-end border-t border-zinc-100 pt-4">
                      <div>
                        <p className="text-sm text-zinc-500 mb-1">Data da compra</p>
                        <p className="text-black font-medium">
                          {new Date(order.created_at).toLocaleDateString("pt-BR", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric"
                          })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-zinc-500 mb-1">Total</p>
                        <p className="text-xl font-bold text-black">
                          R$ {Number(order.total_amount).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="w-full sm:w-auto border-t border-zinc-100 sm:border-0 pt-4 sm:pt-0 sm:pl-6 sm:border-l">
                    <Link
                      href={`/shipments/tracking/${order.id}`}
                      className="flex items-center justify-center gap-2 w-full bg-black text-white px-6 py-3 rounded-xl hover:bg-zinc-800 transition duration-300 font-bold whitespace-nowrap"
                    >
                      Acompanhar
                      <ArrowRight size={18} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
