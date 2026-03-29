import ProductCard from "@/components/ProductCard";


export default function Index({ products }: any) {
  return (
    <div>
      {products.map((product: any) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}