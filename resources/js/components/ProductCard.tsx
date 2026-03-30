import api from "@/services/api"

type Props = {
  product: any
}

export default function ProductCard({ product }: Props) {

  const addToCart = async () => {
    await api.post("/cart-items", {
      product_id: product.id,
      quantity: 1
    })
  }

  return (

    <div className="group">

      {/* imagem */}
      <div className="relative overflow-hidden bg-zinc-100">

        <img
          src={product.image || "https://picsum.photos/400/500"}
          className="w-full h-[320px] object-cover transition duration-500 group-hover:scale-105"
        />

        {/* botão hover */}
        <button
          onClick={addToCart}
          className="
            absolute bottom-4 left-1/2 -translate-x-1/2
            bg-black text-white text-sm
            px-2 py-2
            opacity-0 group-hover:opacity-100
            transition duration-300
            rounded-full
            cursor-pointer
          "
        >
          Adicionar ao carrinho
        </button>

      </div>

      {/* info */}
      <div className="mt-4 space-y-1">

        <h3 className="text-sm font-medium">
          {product.name}
        </h3>

        <p className="text-sm text-zinc-500 line-clamp-2">
          {product.description}
        </p>

        <p className="font-semibold mt-2">
          R$ {product.price.toFixed(2)}
        </p>

      </div>

    </div>

  )
}