import { useEffect, useState } from "react";
import api from "@/services/api";
import ProductCard from "@/components/ProductCard";
import AppLayout from "@/layouts/AppLayout";
import Reveal from "@/components/ui/Reveal";
import { Product, Category } from "@/types";

export default function Home() {

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const ecommerceInfo = [
    "Frete grátis acima de R$199",
    "10% OFF no PIX",
    "Troca grátis em até 7 dias",
    "Entrega para todo Brasil",
    "Nova coleção disponível"
  ];

  useEffect(() => {

    api.get("/products")
      .then(res => setProducts(res.data))
      .catch(() => setProducts([]));

    api.get("/categories")
      .then(res => setCategories(res.data))
      .catch(() => setCategories([]));

  }, []);

  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter(
        product => product?.category?.slug === selectedCategory
      );

  return (
    <AppLayout>

      <div className="min-h-screen pt-6">

        {/* HERO */}
        <Reveal>
          <section className="relative py-40 px-10 border-b border-gray-300">

            <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">

              <div>

                <p className="uppercase text-sm tracking-widest text-zinc-500 mb-6">
                  Nova coleção
                </p>

                <h1 className="text-black text-6xl font-bold leading-tight mb-6">
                  Vista seu <br /> estilo
                </h1>

                <p className="text-zinc-600 mb-10 text-lg max-w-md">
                  Peças modernas e versáteis feitas para quem
                  quer se destacar com conforto e autenticidade.
                </p>

                <div className="flex gap-4">

                  <button
                    onClick={() =>
                      document
                        .getElementById("produtos")
                        ?.scrollIntoView({ behavior: "smooth" })
                    }
                    className="bg-black text-white px-8 py-3 rounded-md hover:opacity-80 transition"
                  >
                    Comprar agora
                  </button>

                  <button
                    onClick={() =>
                      document
                        .getElementById("produtos")
                        ?.scrollIntoView({ behavior: "smooth" })
                    }
                    className="border text-black px-8 py-3 rounded-md hover:bg-black hover:text-white transition"
                  >
                    Ver coleção
                  </button>

                </div>

              </div>

              {/* HERO IMAGE */}
              <div className="w-full h-[500px] bg-zinc-100 rounded-xl flex items-center justify-center text-zinc-400">
                <img src="https://picsum.photos/400/500" alt="Imagem banner" className="w-full" />
              </div>

            </div>

          </section>
        </Reveal>

        {/* CATEGORIAS */}
        <Reveal >
          <section className="px-10 py-16 border-b border-gray-300">

            <div className="max-w-6xl mx-auto">

              <div className="flex gap-4 flex-wrap justify-center">

                <button
                  onClick={() => setSelectedCategory("all")}
                  className={`px-6 py-2 rounded-full border text-sm transition ${selectedCategory === "all"
                    ? "bg-black text-white border-black"
                    : "border-zinc-300 hover:border-black text-black"
                    }`}
                >
                  Todos
                </button>

                {categories.map(category => (

                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.slug)}
                    className={`px-6 py-2 rounded-full border text-sm transition ${selectedCategory === category.slug
                      ? "bg-black text-white border-black"
                      : "border-zinc-300 hover:border-black text-black"
                      }`}
                  >
                    {category.name}
                  </button>

                ))}

              </div>

            </div>

          </section>
        </Reveal>

        {/* PRODUTOS */}
        <Reveal >
          <section
            id="produtos"
            className="px-10 py-20 scroll-mt-64"
          >

            <div className="max-w-6xl mx-auto">

              <div className="flex justify-between items-center mb-12">

                <h2 className="text-3xl font-semibold">
                  Coleção
                </h2>

                <span className="text-sm text-zinc-500">
                  {filteredProducts.length} produtos
                </span>

              </div>

              <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">

                {filteredProducts.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                  />
                ))}

              </div>

            </div>

          </section>
        </Reveal>

        {/* BANNERS */}
        <Reveal >
          <section className="px-10 pb-24">

            <div className="max-w-6xl mx-auto space-y-10">

              {/* banner grande */}
              <div className="relative h-[400px] overflow-hidden rounded-xl group cursor-pointer">

                <img
                  src="https://picsum.photos/400/500"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                />

                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">

                  <div className="text-center text-white">

                    <h3 className="text-4xl font-bold mb-4">
                      Nova Coleção
                    </h3>

                    <button className="bg-white text-black px-6 py-3 rounded-md font-medium hover:opacity-80 transition">
                      Explorar
                    </button>

                  </div>

                </div>

              </div>

              {/* banners menores */}
              <div className="grid md:grid-cols-2 gap-8">

                {/* banner 1 */}
                <div className="relative h-[280px] overflow-hidden rounded-xl group cursor-pointer">

                  <img
                    src="https://picsum.photos/400/500"
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                  />

                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center text-white">

                    <h3 className="text-2xl font-semibold">
                      Streetwear
                    </h3>

                  </div>

                </div>

                {/* banner 2 */}
                <div className="relative h-[280px] overflow-hidden rounded-xl group cursor-pointer">

                  <img
                    src="https://picsum.photos/400/500"
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                  />

                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center text-white">

                    <h3 className="text-2xl font-semibold">
                      Essentials
                    </h3>

                  </div>

                </div>

              </div>

            </div>

          </section>
        </Reveal>

        {/* MARQUEE INFO */}
        <Reveal>
          <section className="border-y border-gray-300 overflow-hidden bg-black text-white">

            <div className="relative flex overflow-hidden py-4">

              {/* faixa 1 */}
              <div className="marquee-track flex gap-16 px-10 whitespace-nowrap">

                {ecommerceInfo.map((info, index) => (
                  <span key={index}>{info}</span>
                ))}

              </div>

              {/* faixa 2 (duplicada) */}
              <div className="marquee-track flex gap-16 px-10 whitespace-nowrap">

                {ecommerceInfo.map((info, index) => (
                  <span key={index}>{info}</span>
                ))}

              </div>

            </div>

          </section>
        </Reveal>

      </div>

    </AppLayout>
  );
}