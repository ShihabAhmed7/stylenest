import "./Home.css";
import React from "react";
import HeroBanner from "../components/HeroBanner";
import ProductCard from "../components/ProductCard";
import { useEffect, useState } from "react";
import { getProducts } from "../services/api";


export default function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getProducts().then((data) => setProducts(data));
  }, []);

  return (
    <div className="page">
      <h2>Our Products</h2>
      <section className="products-grid">
        {products.map((p) => (
          <div key={p.id} className="product-card">
            <img src={p.image} alt={p.name} />
            <h3>{p.name}</h3>
            <p>€{p.price}</p>
          </div>
        ))}
      </section>
    </div>
  );
}

