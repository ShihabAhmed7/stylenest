import { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import { getProducts } from "../services/api";
import "./Products.css";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [gender, setGender] = useState("All");
  const [category, setCategory] = useState("All");
  const [subcategory, setSubcategory] = useState("All");

  useEffect(() => {
    const fetchProducts = async () => {
      const data = await getProducts();
      setProducts(data);
    };
    fetchProducts();
  }, []);

  // --- subcategory options ---
  const subcategoryOptions = {
    Dresses: ["All", "Casual", "Formal", "Party"],
    Shoes: ["All", "Sneakers", "Boots", "Sandals"],
  };

  // --- filtering logic ---
  const filtered = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesGender = gender === "All" || p.gender === gender;
    const matchesCategory = category === "All" || p.category === category;
    const matchesSub =
      subcategory === "All" || p.subcategory === subcategory;
    return matchesSearch && matchesGender && matchesCategory && matchesSub;
  });

  return (
    <div className="page products-page">
      <h2>Explore Our Collection</h2>

      <div className="filters">
        <input
          type="text"
          placeholder="Search products…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select value={gender} onChange={(e) => setGender(e.target.value)}>
          <option value="All">All Genders</option>
          <option value="Men">Men</option>
          <option value="Women">Women</option>
          <option value="Children">Children</option>
        </select>

        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="All">All Categories</option>
          <option value="Dresses">Dresses</option>
          <option value="Shoes">Shoes</option>
        </select>

        {category !== "All" && (
          <select
            value={subcategory}
            onChange={(e) => setSubcategory(e.target.value)}
          >
            {subcategoryOptions[category].map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="products-grid">
        {filtered.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
        {filtered.length === 0 && <p>No products found.</p>}
      </div>
    </div>
  );
};

export default Products;
