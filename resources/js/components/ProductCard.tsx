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
    <div>
      <h3>{product.name}</h3>
      <p>R$ {product.price}</p>

      <button onClick={addToCart}>
        Adicionar ao carrinho
      </button>
    </div>
  );
}