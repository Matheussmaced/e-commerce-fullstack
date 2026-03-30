"use client"

import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { Link, router } from "@inertiajs/react"

export default function Register() {

  const [showPassword, setShowPassword] = useState(false)

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: ""
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    router.post("/register", form)
  }

  return (

    <div className="min-h-screen flex items-center justify-center bg-zinc-100 px-6">

      <div className="w-full max-w-md">

        {/* Card */}
        <div className="
          bg-white
          border border-zinc-200
          rounded-2xl
          shadow-xl
          p-10
        ">

          {/* Título */}
          <div className="mb-8 text-center">

            <h1 className="text-3xl font-bold text-zinc-900">
              Criar conta
            </h1>

            <p className="text-sm text-zinc-500 mt-2">
              Cadastre-se para continuar
            </p>

          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* Name */}
            <div>

              <label className="text-sm text-zinc-600">
                Nome
              </label>

              <input
                type="text"
                required
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
                className="
                  w-full mt-1
                  px-4 py-3
                  border border-zinc-300
                  rounded-lg
                  focus:outline-none
                  focus:ring-2
                  focus:ring-black
                "
                placeholder="Seu nome"
              />

            </div>

            {/* Email */}
            <div>

              <label className="text-sm text-zinc-600">
                Email
              </label>

              <input
                type="email"
                required
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
                className="
                  w-full mt-1
                  px-4 py-3
                  border border-zinc-300
                  rounded-lg
                  focus:outline-none
                  focus:ring-2
                  focus:ring-black
                "
                placeholder="seu@email.com"
              />

            </div>

            {/* Password */}
            <div>

              <label className="text-sm text-zinc-600">
                Senha
              </label>

              <div className="relative">

                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  className="
                    w-full mt-1
                    px-4 py-3 pr-10
                    border border-zinc-300
                    rounded-lg
                    focus:outline-none
                    focus:ring-2
                    focus:ring-black
                  "
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

            {/* Confirm Password */}
            <div>

              <label className="text-sm text-zinc-600">
                Confirmar senha
              </label>

              <input
                type="password"
                required
                value={form.password_confirmation}
                onChange={(e) =>
                  setForm({
                    ...form,
                    password_confirmation: e.target.value
                  })
                }
                className="
                  w-full mt-1
                  px-4 py-3
                  border border-zinc-300
                  rounded-lg
                  focus:outline-none
                  focus:ring-2
                  focus:ring-black
                "
                placeholder="••••••••"
              />

            </div>

            {/* Button */}
            <button
              type="submit"
              className="
                w-full
                bg-black
                text-white
                py-3
                rounded-lg
                font-medium
                hover:bg-zinc-800
                transition
              "
            >
              Criar conta
            </button>

          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">

            <div className="flex-1 h-px bg-zinc-200"></div>

            <span className="text-sm text-zinc-400">
              ou
            </span>

            <div className="flex-1 h-px bg-zinc-200"></div>

          </div>

          {/* Login */}
          <p className="text-center text-sm text-zinc-600">

            Já tem conta?

            <Link
              href="/login"
              className="ml-1 text-black font-medium hover:underline"
            >
              Entrar
            </Link>

          </p>

        </div>

      </div>

    </div>

  )
}