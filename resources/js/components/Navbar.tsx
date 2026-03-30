"use client"

import { useEffect, useState, useRef } from "react"
import { LogOut, LogOutIcon, ShoppingCart, User } from "lucide-react"
import { Link } from "@inertiajs/react"

export default function Navbar() {

  const [scrolled, setScrolled] = useState(false)
  const [openUserMenu, setOpenUserMenu] = useState(false)
  const [isLogged, setIsLogged] = useState(false)


  const dropdownRef = useRef<HTMLDivElement>(null)

  function logout() {

    localStorage.removeItem("token")

    window.location.href = "/login"

  }

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }

    window.addEventListener("scroll", handleScroll)

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // fechar dropdown ao clicar fora
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

  useEffect(() => {
    const token = localStorage.getItem("token")

    if (token) {
      setIsLogged(true)
    }
  }, [])

  return (

    <nav
      className={`
        fixed top-4 left-1/2 -translate-x-1/2 z-50
        w-[100%] max-w-full
        transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]
        backdrop-blur-xl
        bg-white/60

        ${scrolled
          ? "rounded-2xl border border-zinc-100 shadow-2xl shadow-black/40 px-15 py-6 scale-[0.96]"
          : "rounded-none border-transparent px-15 py-5 scale-100"
        }
      `}
    >

      <div className="flex items-center justify-between">

        {/* Logo */}
        <h1 className="text-xl font-bold text-black tracking-wide">
          E-commerce
        </h1>

        {/* Links */}
        <div className="flex items-center gap-8 text-black">

          <a
            href="#produtos"
            className="hover:text-white transition-colors duration-300"
          >
            Produtos
          </a>

          {/* User */}
          {isLogged ? (

            <button
              onClick={logout}
              className="hover:text-red-500 transition cursor-pointer"
            >
              <LogOutIcon />
            </button>

          ) : (

            <div className="relative" ref={dropdownRef}>

              <button
                onClick={() => setOpenUserMenu(!openUserMenu)}
                className="hover:text-gray-600 transition cursor-pointer"
              >
                <User size={22} />
              </button>

              {openUserMenu && (

                <div className="absolute right-0 mt-4 w-40 rounded-xl border border-gray-200 bg-white shadow-xl py-2">

                  <Link
                    href="/login"
                    className="block px-4 py-2 text-sm hover:bg-zinc-100"
                  >
                    Login
                  </Link>

                  <Link
                    href="/register"
                    className="block px-4 py-2 text-sm hover:bg-zinc-100"
                  >
                    Registrar
                  </Link>

                </div>

              )}

            </div>

          )}

          {/* Cart */}
          <Link
            href="/cart"
            className="relative hover:text-gray-700 transition-colors duration-300"
          >

            <ShoppingCart size={22} />

            <span className="absolute -top-2 -right-2 text-xs bg-green-500 text-black px-1.5 rounded-full">
              2
            </span>

          </Link>

        </div>

      </div>

    </nav>

  )
}