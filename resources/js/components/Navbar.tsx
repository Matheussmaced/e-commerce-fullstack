"use client"

import { useEffect, useState, useRef } from "react"
import { LayoutDashboard, LogOutIcon, ShoppingCart, User, Menu, X, Package } from "lucide-react"
import { Link } from "@inertiajs/react"
import { useInitials } from "@/hooks/use-initials"
import api from "@/services/api"
import { User as UserType } from "@/types"
import ProfileModal from "./ProfileModal"
import { useCart } from "@/contexts/CartContext"

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [openUserMenu, setOpenUserMenu] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false) // <-- Novo estado para o mobile
  const [isLogged, setIsLogged] = useState(false)
  const [user, setUser] = useState<UserType | null>(null)
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const { totalQuantity } = useCart()

  const dropdownRef = useRef<HTMLDivElement>(null)

  function logout() {
    localStorage.removeItem("token")
    window.location.href = "/login"
  }

  // Monitorar scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Fechar dropdown de usuário ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpenUserMenu(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Buscar dados do usuário
  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      setIsLogged(true)
      api.get("/me")
        .then(response => {
          setUser(response.data)
        })
        .catch(() => {
          setIsLogged(false)
          localStorage.removeItem("token")
        })
    }
  }, [])

  return (
    <nav
      className={`
        fixed top-4 left-1/2 -translate-x-1/2 z-50
        w-[95%] max-w-7xl
        transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]
        backdrop-blur-xl
        bg-white/60
        border border-zinc-100 shadow-2xl shadow-black/5
        ${scrolled
          ? "rounded-2xl px-6 py-4 scale-[0.98]"
          : "rounded-2xl px-6 py-5 scale-100"
        }
      `}
    >
      <div className="flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-black tracking-wide hover:opacity-70 transition-opacity">
          E-commerce
        </Link>

        {/* --- DESKTOP MENU --- */}
        <div className="hidden md:flex items-center gap-8 text-black">
          <Link
            href="/products"
            className="text-sm font-medium hover:text-gray-700 transition-colors duration-300"
          >
            Produtos
          </Link>

          {/* User Dropdown (Desktop) */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setOpenUserMenu(!openUserMenu)}
              className="hover:text-black transition cursor-pointer flex items-center gap-2 group"
            >
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center transition
                ${openUserMenu ? "bg-zinc-900 text-white" : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 hover:text-black"}
              `}>
                <User size={20} />
              </div>
            </button>

            {openUserMenu && (
              <div className="absolute right-0 mt-4 w-56 rounded-2xl border border-zinc-100 bg-white/95 shadow-2xl py-3 px-2 backdrop-blur-xl animate-in fade-in zoom-in duration-200">
                {isLogged ? (
                  <>
                    <div className="px-4 py-3 mb-2 border-b border-zinc-50">
                      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Logado como</p>
                      <p className="text-sm font-bold text-zinc-900 truncate">{user?.name}</p>
                    </div>

                    <button
                      onClick={() => {
                        setOpenUserMenu(false)
                        setIsProfileModalOpen(true)
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-zinc-600 hover:bg-zinc-50 hover:text-black rounded-xl transition cursor-pointer"
                    >
                      <User size={18} />
                      Ver Perfil
                    </button>

                    <Link
                      href="/orders"
                      onClick={() => setOpenUserMenu(false)}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-zinc-600 hover:bg-zinc-50 hover:text-black rounded-xl transition cursor-pointer"
                    >
                      <Package size={18} />
                      Meus Pedidos
                    </Link>

                    <button
                      onClick={() => {
                        setOpenUserMenu(false)
                        logout()
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-50 rounded-xl transition cursor-pointer"
                    >
                      <LogOutIcon size={18} />
                      Sair
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setOpenUserMenu(false)}
                      className="block px-4 py-3 text-sm text-zinc-600 hover:bg-zinc-50 hover:text-black rounded-xl transition"
                    >
                      Login
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setOpenUserMenu(false)}
                      className="block px-4 py-3 text-sm text-zinc-600 hover:bg-zinc-50 hover:text-black rounded-xl transition"
                    >
                      Registrar
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Dashboard (Admin Only) */}
          {isLogged && user?.role === 'admin' && (
            <Link
              href="/dashboard"
              className="group relative flex items-center"
              title="Painel Admin"
            >
              <div className="w-10 h-10 rounded-full flex items-center justify-center transition bg-zinc-100 text-zinc-600 hover:bg-zinc-900 hover:text-white">
                <LayoutDashboard size={20} />
              </div>
            </Link>
          )}

          {/* Cart */}
          <Link
            href="/cart"
            className="relative hover:text-gray-700 transition-colors duration-300"
          >
            <ShoppingCart size={22} />
            <span className="absolute -top-2 -right-2 text-xs bg-green-500 text-black px-1.5 rounded-full font-bold">
              {totalQuantity}
            </span>
          </Link>
        </div>

        {/* --- MOBILE TOGGLE BUTTON --- */}
        <div className="flex items-center gap-4 md:hidden">
          {/* Mantive o carrinho visível direto no topo também no mobile, é uma boa prática! */}
          <Link
            href="/cart"
            className="relative hover:text-gray-700 transition-colors duration-300"
          >
            <ShoppingCart size={22} color="black" />
            <span className="absolute -top-2 -right-2 text-xs bg-green-500 text-black px-1.5 rounded-full font-bold">
              2
            </span>
          </Link>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-zinc-100 text-zinc-600 cursor-pointer"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* --- MOBILE DROPDOWN MENU --- */}
      {isMobileMenuOpen && (
        <div className="md:hidden mt-4 pt-4 border-t border-zinc-100 animate-in fade-in slide-in-from-top-5 duration-300">
          <div className="flex flex-col gap-2">

            {/* Produtos */}
            <Link
              href="/products"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center px-4 py-3 text-sm font-medium text-zinc-700 hover:bg-zinc-50 rounded-xl transition"
            >
              Produtos
            </Link>

            {/* Dashboard se for admin */}
            {isLogged && user?.role === 'admin' && (
              <Link
                href="/dashboard"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-zinc-700 hover:bg-zinc-50 rounded-xl transition"
              >
                <LayoutDashboard size={18} />
                Painel Admin
              </Link>
            )}

            <div className="my-2 border-t border-zinc-50"></div>

            {/* Parte de Usuário (Mobile) */}
            {isLogged ? (
              <>
                <div className="px-4 py-2">
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Logado como</p>
                  <p className="text-sm font-bold text-zinc-900 truncate">{user?.name}</p>
                </div>

                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false)
                    setIsProfileModalOpen(true)
                  }}
                  className="flex items-center gap-3 px-4 py-3 text-sm text-zinc-600 hover:bg-zinc-50 hover:text-black rounded-xl transition cursor-pointer"
                >
                  <User size={18} />
                  Ver Perfil
                </button>

                <Link
                  href="/orders"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-sm text-zinc-600 hover:bg-zinc-50 hover:text-black rounded-xl transition cursor-pointer"
                >
                  <Package size={18} />
                  Meus Pedidos
                </Link>

                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false)
                    logout()
                  }}
                  className="flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-50 rounded-xl transition cursor-pointer"
                >
                  <LogOutIcon size={18} />
                  Sair
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center px-4 py-3 text-sm text-zinc-600 hover:bg-zinc-50 hover:text-black rounded-xl transition"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center px-4 py-3 text-sm text-zinc-600 hover:bg-zinc-50 hover:text-black rounded-xl transition"
                >
                  Registrar
                </Link>
              </>
            )}
          </div>
        </div>
      )}

      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onUpdate={(updatedUser) => setUser(updatedUser)}
      />
    </nav>
  )
}