"use client"

import { useEffect, useState } from "react"
import { User, Mail, Shield, Trash2, Save, LogOut } from "lucide-react"
import api from "@/services/api"
import { User as UserType } from "@/types"
import { router } from "@inertiajs/react"

export default function Profile() {
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
    const token = localStorage.getItem("token")
    if (!token) {
      window.location.href = "/login"
      return
    }

    fetchProfile()
  }, [])

  async function fetchProfile() {
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
      localStorage.removeItem("token")
      window.location.href = "/login"
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
      setUser(response.data.user)
      setMessage({ type: "success", text: "Perfil atualizado com sucesso!" })
      setForm({ ...form, password: "", password_confirmation: "" })
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

  function logout() {
    localStorage.removeItem("token")
    window.location.href = "/login"
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-50 pt-28 pb-12 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl border border-zinc-100 overflow-hidden">
          {/* Header */}
          <div className="bg-zinc-900 px-8 py-12 text-white relative">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center text-zinc-900 text-4xl font-bold shadow-2xl border-4 border-white/20">
                {user?.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-3xl font-bold">{user?.name}</h1>
                <div className="flex items-center gap-2 mt-2 text-zinc-400">
                  <Shield size={16} />
                  <span className="text-sm uppercase tracking-widest font-bold">
                    {user?.role === 'admin' ? 'Administrador' : 'Cliente'}
                  </span>
                </div>
              </div>
            </div>
            
            <button 
              onClick={logout}
              className="absolute top-8 right-8 flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl transition text-sm font-medium"
            >
              <LogOut size={18} />
              Sair
            </button>
          </div>

          <div className="p-8">
            {message.text && (
              <div className={`mb-8 p-4 rounded-xl border ${
                message.type === 'success' 
                  ? 'bg-green-50 border-green-100 text-green-700' 
                  : 'bg-red-50 border-red-100 text-red-700'
              }`}>
                {message.text}
              </div>
            )}

            <form onSubmit={handleUpdate} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-2 block">
                    Nome Completo
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full pl-12 pr-4 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:ring-2 focus:ring-black focus:border-transparent transition text-black"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-2 block">
                    Endereço de Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full pl-12 pr-4 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:ring-2 focus:ring-black focus:border-transparent transition text-black"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-zinc-100">
                <h3 className="text-lg font-bold mb-6">Alterar Senha</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-2 block">
                      Nova Senha
                    </label>
                    <input
                      type="password"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      className="w-full px-4 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:ring-2 focus:ring-black focus:border-transparent transition text-black"
                      placeholder="Deixe em branco para não alterar"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-2 block">
                      Confirmar Senha
                    </label>
                    <input
                      type="password"
                      value={form.password_confirmation}
                      onChange={(e) => setForm({ ...form, password_confirmation: e.target.value })}
                      className="w-full px-4 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:ring-2 focus:ring-black focus:border-transparent transition text-black"
                      placeholder="Repita a nova senha"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                <button
                  type="submit"
                  disabled={updating}
                  className="w-full md:w-auto px-8 py-4 bg-zinc-900 text-white rounded-2xl font-bold hover:bg-zinc-800 transition shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Save size={20} />
                  {updating ? "Salvando..." : "Salvar Alterações"}
                </button>

                <button
                  type="button"
                  onClick={handleDeleteAccount}
                  className="w-full md:w-auto px-8 py-4 text-red-500 hover:bg-red-50 rounded-2xl font-bold transition flex items-center justify-center gap-2"
                >
                  <Trash2 size={20} />
                  Excluir Minha Conta
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
