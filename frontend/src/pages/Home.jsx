import "./Home.css";
import React, { useEffect, useState } from "react";
import HeroBanner from "../components/HeroBanner";
import ProductCard from "../components/ProductCard";
import { getProducts } from "../services/api";

export default function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getProducts().then((data) => setProducts(data));
  }, []);

  return (
    <div className="page">
      {/* Optional hero banner */}
      <HeroBanner />

      <h2>Our Products</h2>

      <section className="products-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </section>
    </div>
  );
}
