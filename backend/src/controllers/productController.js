import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "path";

const dbPath = path.resolve("./src/data/stylenest.db");

const connectDB = async () => {
  return open({ filename: dbPath, driver: sqlite3.Database });
};

// --- GET all products ---
export const getProducts = async (req, res) => {
  try {
    const db = await connectDB();
    const products = await db.all("SELECT * FROM products");
    await db.close();
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Error fetching products" });
  }
};

// --- GET product by ID ---
export const getProductById = async (req, res) => {
  try {
    const db = await connectDB();
    const product = await db.get("SELECT * FROM products WHERE id = ?", [
      req.params.id,
    ]);
    await db.close();

    if (!product)
      return res.status(404).json({ message: "Product not found" });

    res.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ message: "Error fetching product" });
  }
};

// --- GET all unique categories and subcategories ---
export const getCategories = async (req, res) => {
  try {
    const db = await connectDB();
    const categories = await db.all(`
      SELECT DISTINCT category, subcategory
      FROM products
      ORDER BY category, subcategory
    `);
    await db.close();

    // Convert to grouped structure
    const grouped = {};
    categories.forEach((row) => {
      if (!grouped[row.category]) grouped[row.category] = [];
      grouped[row.category].push(row.subcategory);
    });

    res.json(grouped);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: "Error fetching categories" });
  }
};

// --- PUT update stock ---
export const updateStock = async (req, res) => {
  const { id } = req.params;
  const { stock } = req.body;

  if (stock == null || isNaN(stock)) {
    return res.status(400).json({ message: "Invalid stock value" });
  }

  try {
    const db = await connectDB();
    const result = await db.run("UPDATE products SET stock = ? WHERE id = ?", [
      stock,
      id,
    ]);
    await db.close();

    if (result.changes === 0)
      return res.status(404).json({ message: "Product not found" });

    res.json({ message: "Stock updated successfully", newStock: stock });
  } catch (error) {
    console.error("Error updating stock:", error);
    res.status(500).json({ message: "Error updating stock" });
  }
};
