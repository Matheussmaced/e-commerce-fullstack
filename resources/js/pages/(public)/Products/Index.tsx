import ProductCard from "@/components/ProductCard";
import { Product } from "@/types";

export default function Index({ products }: { products: Product[] }) {
  return (
    <div>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}