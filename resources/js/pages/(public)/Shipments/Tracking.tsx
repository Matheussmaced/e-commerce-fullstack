"use client"

import React, { useEffect, useState } from "react"
import AppLayout from "@/layouts/AppLayout"
import { Package, Truck, Home, Clock, AlertCircle } from "lucide-react"
import api from "@/services/api"

interface Shipment {
  id: string
  order_id: string
  shipping_cost: number
  status: 'preparing' | 'shipped' | 'delivered' | 'cancelled'
  tracking_code: string | null
}

export default function Tracking({ order_id }: { order_id: string }) {
  const [shipment, setShipment] = useState<Shipment | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchShipment = async () => {
      try {
        setLoading(true)
        const response = await api.get(`/shipments/order/${order_id}`)
        setShipment(response.data)
      } catch (err) {
        console.error("Error fetching shipment:", err)
        setError("Não foi possível encontrar as informações de rastreio para este pedido.")
      } finally {
        setLoading(false)
      }
    }

    if (order_id) {
      fetchShipment()
    }
  }, [order_id])

  const steps = [
    { id: 'preparing', label: 'Preparando', icon: Clock },
    { id: 'shipped', label: 'Enviado', icon: Truck },
    { id: 'delivered', label: 'Entregue', icon: Home },
  ]

  const getCurrentStepIndex = () => {
    if (!shipment) return 0
    return steps.findIndex(step => step.id === shipment.status)
  }

  if (loading) {
    return (
      <AppLayout>
        <div className="pt-32 px-6 max-w-7xl mx-auto flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
        </div>
      </AppLayout>
    )
  }

  if (error || !shipment) {
    return (
      <AppLayout>
        <div className="pt-32 px-6 max-w-7xl mx-auto flex flex-col items-center justify-center min-h-[60vh] text-center">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6">
            <AlertCircle size={32} />
          </div>
          <h2 className="text-2xl font-bold text-black mb-2">Ops! Ocorreu um erro</h2>
          <p className="text-zinc-500 mb-8 max-w-md">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-black text-white px-8 py-3 rounded-full hover:bg-zinc-800 transition"
          >
            Tentar Novamente
          </button>
        </div>
      </AppLayout>
    )
  }

  const currentStep = getCurrentStepIndex()

  return (
    <AppLayout>
      <div className="pt-32 pb-20 px-6 max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-bold text-black mb-2">Rastreio do Pedido</h1>
            <p className="text-zinc-500 font-mono text-sm tracking-tight">ID: {order_id}</p>
          </div>
          <div className="bg-zinc-100 px-6 py-3 rounded-full flex items-center gap-3">
            <Package size={20} className="text-zinc-400" />
            <span className="font-bold text-black capitalize">{shipment.status}</span>
          </div>
        </div>

        <div className="bg-white border border-zinc-100 rounded-3xl p-8 md:p-12 shadow-sm mb-12">
          {/* Progress Bar Container */}
          <div className="relative flex justify-between items-center max-w-2xl mx-auto mb-20 px-4">
            {/* Background Line */}
            <div className="absolute top-1/2 left-0 w-full h-[2px] bg-zinc-100 -translate-y-1/2 z-0" />
            
            {/* Progress Line */}
            <div 
              className="absolute top-1/2 left-0 h-[2px] bg-black -translate-y-1/2 z-0 transition-all duration-1000 ease-out" 
              style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
            />

            {steps.map((step, index) => {
              const Icon = step.icon
              const isActive = index <= currentStep
              const isCurrent = index === currentStep

              return (
                <div key={step.id} className="relative z-10 flex flex-col items-center">
                  <div className={`
                    w-14 h-14 rounded-full flex items-center justify-center transition-all duration-500
                    ${isActive ? "bg-black text-white scale-110 shadow-lg shadow-black/20" : "bg-white border-2 border-zinc-100 text-zinc-300"}
                  `}>
                    <Icon size={24} />
                  </div>
                  <div className="absolute top-full mt-6 flex flex-col items-center min-w-[120px]">
                    <span className={`text-sm font-bold mt-1 ${isActive ? "text-black" : "text-zinc-400"}`}>
                      {step.label}
                    </span>
                    {isCurrent && (
                      <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mt-1 animate-pulse">
                        Status atual
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-32 border-t border-zinc-50 pt-12">
            <div>
              <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-4">Informações de Envio</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Código de Rastreio</span>
                  <span className="font-bold text-black">{shipment.tracking_code || "Aguardando geração"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Custo de Entrega</span>
                  <span className="font-bold text-green-600 font-sans">
                    {shipment.shipping_cost === 0 ? "Grátis" : `R$ ${shipment.shipping_cost.toFixed(2)}`}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-4">Estimativa</h3>
              <div className="space-y-4">
                <p className="text-sm text-zinc-500 leading-relaxed">
                  Trabalhamos com os melhores parceiros logísticos para garantir que seu pedido chegue o mais rápido possível e com total segurança.
                </p>
                <div className="bg-black/5 p-4 rounded-2xl flex items-center gap-3">
                  <Truck size={18} className="text-black" />
                  <span className="text-sm font-bold text-black">Entrega estimada em 3-5 dias úteis</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-12">
           <button 
             onClick={() => window.location.href = '/products'}
             className="text-zinc-400 hover:text-black transition flex items-center gap-2 font-medium"
           >
             <ShoppingBag size={18} />
             Continuar Comprando
           </button>
        </div>
      </div>
    </AppLayout>
  )
}
