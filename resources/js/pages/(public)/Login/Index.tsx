"use client"

import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { Link, router } from "@inertiajs/react"
import api from "@/services/api"

export default function Login() {

  const [showPassword, setShowPassword] = useState(false)

  const [form, setForm] = useState({
    email: "",
    password: ""
  })

  const [errorMessage, setErrorMessage] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    setErrorMessage("")

    try {

      const response = await api.post("/login", form)

      localStorage.setItem("token", response.data.token)

      window.location.href = "/"

    } catch (error: any) {

      if (error.response?.status === 401) {
        setErrorMessage("Email ou senha incorretos")
      } else {
        setErrorMessage("Erro ao conectar com o servidor")
      }

    }
  }

  function handleChange(field: string, value: string) {

    setForm({
      ...form,
      [field]: value
    })

    if (errorMessage) {
      setErrorMessage("")
    }

  }

  return (

    <div className="min-h-screen flex items-center justify-center bg-zinc-100 px-6">

      <div className="w-full max-w-md">

        <div className="bg-white border border-zinc-200 rounded-2xl shadow-xl p-10">

          <div className="mb-8 text-center">

            <h1 className="text-3xl font-bold text-zinc-900">
              Entrar
            </h1>

            <p className="text-sm text-zinc-500 mt-2">
              Acesse sua conta
            </p>

          </div>

          {errorMessage && (

            <div className="mb-5 bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-lg">
              {errorMessage}
            </div>

          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            <div>

              <label className="text-sm text-zinc-600">
                Email
              </label>

              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className="w-full mt-1 px-4 py-3 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-black text-black"
                placeholder="seu@email.com"
              />

            </div>

            <div>

              <label className="text-sm text-zinc-600">
                Senha
              </label>

              <div className="relative">

                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={form.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  className="w-full mt-1 px-4 py-3 pr-10 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-black text-black"
                  placeholder="••••••••"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500"
                >
                  {showPassword
                    ? <EyeOff size={18} />
                    : <Eye size={18} />
                  }
                </button>

              </div>

            </div>

            <button
              type="submit"
              className="cursor-pointer w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-zinc-800 transition"
            >
              Entrar
            </button>

          </form>

          <div className="flex items-center gap-4 my-6">

            <div className="flex-1 h-px bg-zinc-200"></div>
            <span className="text-sm text-zinc-400">ou</span>
            <div className="flex-1 h-px bg-zinc-200"></div>

          </div>

          <p className="text-center text-sm text-zinc-600">

            Não tem conta?

            <Link
              href="/register"
              className="ml-1 text-black font-medium hover:underline"
            >
              Criar conta
            </Link>

          </p>

        </div>

      </div>

    </div>

  )
}