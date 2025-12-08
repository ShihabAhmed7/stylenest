// src/api/products.js
// UI imports only these functions:
//   - listProducts()
//   - getProductById(id)
//
// Today: returns hardcoded products.
// Later: set VITE_USE_API=true and VITE_API_BASE_URL=http://localhost:5000/api
// and it will fetch from your Express + SQLite backend.
// No UI/component changes needed.

import { products as hardcodedProducts } from "../data/products.js";
import { http } from "./http.js";

// Controlled via .env at the frontend root:
// VITE_USE_API=true
// VITE_API_BASE_URL=http://localhost:5000/api
const USE_API = String(import.meta.env.VITE_USE_API || "false").toLowerCase() === "true";

// Small helper: in case backend returns different field types later
function normalizeProduct(p) {
  if (!p) return null;
  return {
    id: String(p.id),
    name: p.name,
    category: p.category,
    price: Number(p.price),
    image: p.image,
    description: p.description
  };
}

export async function listProducts() {
  // Hardcoded mode (default)
  if (!USE_API) return hardcodedProducts;

  // API mode
  try {
    const res = await http.get("/products");
    // Expect backend returns an array of products
    const data = Array.isArray(res.data) ? res.data : [];
    return data.map(normalizeProduct);
  } catch (err) {
    console.error("listProducts() API failed, using hardcoded fallback:", err?.message || err);
    return hardcodedProducts; // fallback so UI doesn't break
  }
}

export async function getProductById(id) {
  // Hardcoded mode (default)
  if (!USE_API) return hardcodedProducts.find((p) => p.id === id) || null;

  // API mode
  try {
    const res = await http.get(`/products/${id}`);
    return normalizeProduct(res.data);
  } catch (err) {
    // If not found or server down, fallback to hardcoded
    console.error("getProductById() API failed, using hardcoded fallback:", err?.message || err);
    return hardcodedProducts.find((p) => p.id === id) || null;
  }
}
