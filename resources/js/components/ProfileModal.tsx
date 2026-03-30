"use client"

import { Fragment, useEffect, useState } from "react"
import { Dialog, Transition } from "@headlessui/react"
import { User, Mail, Shield, Trash2, Save, X } from "lucide-react"
import api from "@/services/api"
import { User as UserType } from "@/types"

interface ProfileModalProps {
  isOpen: boolean
  onClose: () => void
  onUpdate?: (user: UserType) => void
}

export default function ProfileModal({ isOpen, onClose, onUpdate }: ProfileModalProps) {
  const [user, setUser] = useState<UserType | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [message, setMessage] = useState({ type: "", text: "" })
  
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: ""
  })

  useEffect(() => {
    if (isOpen) {
      fetchProfile()
    }
  }, [isOpen])

  async function fetchProfile() {
    setLoading(true)
    try {
      const response = await api.get("/me")
      setUser(response.data)
      setForm({
        ...form,
        name: response.data.name,
        email: response.data.email
      })
    } catch (error) {
      console.error("Error fetching profile", error)
    } finally {
      setLoading(false)
    }
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault()
    setUpdating(true)
    setMessage({ type: "", text: "" })

    try {
      const payload: any = {
        name: form.name,
        email: form.email
      }

      if (form.password) {
        payload.password = form.password
        payload.password_confirmation = form.password_confirmation
      }

      const response = await api.put("/me", payload)
      const updatedUser = response.data.user
      setUser(updatedUser)
      setMessage({ type: "success", text: "Perfil atualizado com sucesso!" })
      setForm({ ...form, password: "", password_confirmation: "" })
      
      if (onUpdate) {
        onUpdate(updatedUser)
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || "Erro ao atualizar perfil"
      setMessage({ type: "error", text: errorMsg })
    } finally {
      setUpdating(false)
    }
  }

  async function handleDeleteAccount() {
    if (!confirm("Tem certeza que deseja excluir sua conta? Esta ação é irreversível.")) {
      return
    }

    try {
      await api.delete("/me")
      localStorage.removeItem("token")
      window.location.href = "/login"
    } catch (error) {
      setMessage({ type: "error", text: "Erro ao excluir conta" })
    }
  }

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[100]" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-3xl bg-white text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-2xl">
                {/* Header Profile */}
                <div className="bg-zinc-900 px-8 py-10 text-white relative">
                  <button 
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/10 transition text-white/70 hover:text-white"
                  >
                    <X size={20} />
                  </button>

                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center text-zinc-900 text-3xl font-bold shadow-xl border-4 border-white/20">
                      {user?.name ? user.name.charAt(0).toUpperCase() : '?'}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">{user?.name || 'Carregando...'}</h2>
                      <div className="flex items-center gap-2 mt-1 text-zinc-400">
                        <Shield size={14} />
                        <span className="text-xs uppercase tracking-widest font-bold">
                          {user?.role === 'admin' ? 'Administrador' : 'Cliente'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-8">
                  {loading ? (
                    <div className="py-12 flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
                    </div>
                  ) : (
                    <>
                      {message.text && (
                        <div className={`mb-6 p-4 rounded-xl border ${
                          message.type === 'success' 
                            ? 'bg-green-50 border-green-100 text-green-700' 
                            : 'bg-red-50 border-red-100 text-red-700'
                        }`}>
                          {message.text}
                        </div>
                      )}

                      <form onSubmit={handleUpdate} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <div>
                            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.15em] mb-1.5 block">
                              Nome Completo
                            </label>
                            <div className="relative">
                              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                              <input
                                type="text"
                                required
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                className="w-full pl-11 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent transition text-sm text-black"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.15em] mb-1.5 block">
                              Email
                            </label>
                            <div className="relative">
                              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                              <input
                                type="email"
                                required
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                className="w-full pl-11 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent transition text-sm text-black"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="pt-4 border-t border-zinc-50">
                          <p className="text-xs font-bold text-zinc-900 mb-4">Segurança</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.15em] mb-1.5 block">
                                Nova Senha
                              </label>
                              <input
                                type="password"
                                value={form.password}
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                                className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent transition text-sm text-black"
                                placeholder="Manter atual"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.15em] mb-1.5 block">
                                Confirmar Senha
                              </label>
                              <input
                                type="password"
                                value={form.password_confirmation}
                                onChange={(e) => setForm({ ...form, password_confirmation: e.target.value })}
                                className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent transition text-sm text-black"
                                placeholder="Repita a nova senha"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                          <button
                            type="submit"
                            disabled={updating}
                            className="w-full sm:w-auto px-6 py-3 bg-zinc-900 text-white rounded-xl font-bold hover:bg-zinc-800 transition shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 text-sm"
                          >
                            <Save size={18} />
                            {updating ? "Salvando..." : "Salvar"}
                          </button>

                          <button
                            type="button"
                            onClick={handleDeleteAccount}
                            className="w-full sm:w-auto px-6 py-3 text-red-500 hover:bg-red-50 rounded-xl font-bold transition flex items-center justify-center gap-2 text-xs"
                          >
                            <Trash2 size={16} />
                            Excluir Conta
                          </button>
                        </div>
                      </form>
                    </>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
