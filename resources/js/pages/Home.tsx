import { useEffect, useState } from "react";
import api from "@/services/api";
import ProductCard from "@/components/ProductCard";

export default function Home() {

  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    api.get("/products")
      .then(res => setProducts(res.data));
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">

      {/* HERO */}
      <section className="relative py-32 px-10 border-b border-zinc-800 bg-gradient-to-b from-green-900/20 to-black">

        <div className="max-w-5xl">

          <p className="text-green-400 text-sm mb-4">
            Nova geração disponível
          </p>

          <h1 className="text-6xl font-bold leading-tight mb-6">
            Gaming Gear <br />
            de Alta Performance
          </h1>

          <p className="text-zinc-400 max-w-xl mb-8">
            Equipamentos desenvolvidos para performance máxima,
            design premium e experiência imersiva.
          </p>

          <div className="flex gap-4">

            <button className="bg-green-500 hover:bg-green-400 text-black font-semibold px-6 py-3 rounded-lg">
              Comprar agora
            </button>

            <button className="border border-zinc-700 px-6 py-3 rounded-lg hover:border-green-500">
              Ver produtos
            </button>

          </div>

        </div>

      </section>

      {/* FEATURES */}
      <section className="px-10 py-16 border-b border-zinc-800">

        <div className="grid md:grid-cols-3 gap-10 text-center">

          <div>
            <h3 className="text-xl font-semibold mb-2">
              ⚡ Performance extrema
            </h3>
            <p className="text-zinc-400 text-sm">
              Hardware otimizado para jogos e produtividade.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">
              🎮 Design gamer
            </h3>
            <p className="text-zinc-400 text-sm">
              Estética moderna com iluminação RGB e construção premium.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">
              🚀 Tecnologia de ponta
            </h3>
            <p className="text-zinc-400 text-sm">
              Equipamentos preparados para o futuro.
            </p>
          </div>

        </div>

      </section>

      {/* PRODUTOS */}
      <section className="px-10 py-20">

        <div className="flex justify-between items-center mb-10">

          <h2 className="text-3xl font-bold">
            Produtos em destaque
          </h2>

          <span className="text-zinc-400">
            {products.length} produtos
          </span>

        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">

          {products.map(product => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}

        </div>

      </section>

    </div>
  );
}