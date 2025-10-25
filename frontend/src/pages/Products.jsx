import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import "./Products.css";
import { getProducts } from "../services/api";

const Products = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const data = await getProducts();
      setProducts(data);
    };
    fetchProducts();
  }, []);

  return (
    <div className="page">
      <h2>Products</h2>
      <p>Explore our latest collection!</p>
      <div className="product-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Products;
