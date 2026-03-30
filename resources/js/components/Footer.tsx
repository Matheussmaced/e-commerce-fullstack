"use client"

import { Link } from "@inertiajs/react"
import { Instagram, Twitter, Github } from "lucide-react"

export default function Footer() {

  return (

    <footer className="mt-32 border-t border-zinc-200 bg-white/60 backdrop-blur-xl">

      <div className="max-w-6xl mx-auto px-10 py-16">

        <div className="grid md:grid-cols-4 gap-12">

          {/* Marca */}
          <div>

            <h2 className="text-2xl font-bold tracking-wide mb-4">
              E-commerce
            </h2>

            <p className="text-zinc-600 text-sm leading-relaxed">
              Peças modernas e minimalistas feitas para quem
              quer expressar estilo com autenticidade.
            </p>

          </div>

          {/* Navegação */}
          <div>

            <h3 className="font-semibold mb-4">
              Navegação
            </h3>

            <div className="flex flex-col gap-2 text-zinc-600 text-sm">

              <a href="#produtos" className="hover:text-black transition">
                Produtos
              </a>

              <Link href="/cart" className="hover:text-black transition">
                Carrinho
              </Link>

              <Link href="/checkout" className="hover:text-black transition">
                Checkout
              </Link>

            </div>

          </div>

          {/* Suporte */}
          <div>

            <h3 className="font-semibold mb-4">
              Suporte
            </h3>

            <div className="flex flex-col gap-2 text-zinc-600 text-sm">

              <a href="#" className="hover:text-black transition">
                Contato
              </a>

              <a href="#" className="hover:text-black transition">
                Trocas e devoluções
              </a>

              <a href="#" className="hover:text-black transition">
                Política de privacidade
              </a>

            </div>

          </div>

          {/* Redes */}
          <div>

            <h3 className="font-semibold mb-4">
              Redes
            </h3>

            <div className="flex gap-4 text-zinc-600">

              <a className="hover:text-black transition">
                <Instagram size={20} />
              </a>

              <a className="hover:text-black transition">
                <Twitter size={20} />
              </a>

              <a className="hover:text-black transition">
                <Github size={20} />
              </a>

            </div>

          </div>

        </div>

        {/* Linha inferior */}
        <div className="border-t border-zinc-200 mt-12 pt-6 flex justify-between text-sm text-zinc-500">

          <span>
            © {new Date().getFullYear()} E-commerce
          </span>

          <span>
            Todos os direitos reservados
          </span>

        </div>

      </div>

    </footer>

  )
}