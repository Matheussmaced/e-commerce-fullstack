import api from "@/services/api";

type Props = {
  product: any;
};

export default function ProductCard({ product }: Props) {

  const addToCart = async () => {
    await api.post("/cart-items", {
      product_id: product.id,
      quantity: 1
    });
  };

  return (
    <div className="group relative bg-gradient-to-b from-zinc-900 to-black border border-zinc-800 rounded-xl overflow-hidden hover:border-green-500 transition-all duration-300">

      {/* imagem */}
      <div className="h-52 flex items-center justify-center bg-zinc-900">
        <img
          src="/placeholder-product.png"
          className="h-40 object-contain group-hover:scale-105 transition"
        />
      </div>

      <div className="p-5 space-y-3">

        <h3 className="text-xl font-bold group-hover:text-green-400 transition">
          {product.name}
        </h3>

        <p className="text-zinc-400 text-sm line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between pt-3">

          <div>
            <p className="text-green-400 font-bold text-xl">
              R$ {product.price.toFixed(2)}
            </p>
            <p className="text-xs text-zinc-500">
              {product.stock} em estoque
            </p>
          </div>

          <button
            onClick={addToCart}
            className="bg-green-500 hover:bg-green-400 text-black font-semibold px-4 py-2 rounded-lg transition"
          >
            Comprar
          </button>

        </div>

      </div>

    </div>
  );
}