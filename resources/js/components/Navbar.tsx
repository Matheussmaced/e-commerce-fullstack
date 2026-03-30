"use client"

import { useEffect, useState } from "react"
import { ShoppingCart } from "lucide-react"
import { Link } from "@inertiajs/react"

export default function Navbar() {

  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }

    window.addEventListener("scroll", handleScroll)

    return () => window.removeEventListener("scroll", handleScroll)
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
          ? "rounded-2xl border border-zinc-100 shadow-2xl shadow-black/40 px-6 py-6 scale-[0.96]"
          : "rounded-none border-transparent px-10 py-5 scale-100"
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

          <Link
            href="/cart"
            className="relative hover:text-white transition-colors duration-300"
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