import { useEffect, useState } from "react";
import api from "@/services/api";

export default function Home() {

  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.get("/products")
      .then(res => setProducts(res.data));

    console.log(products);
  }, []);

  return (
    <div>
      <h1>Home com produtos</h1>

      {products.map((product: any) => (
        product ? <div key={product.id}>
          {product.name}
        </div> : "Nenhum produto encontrado"
      ))}

    </div>
  );
}