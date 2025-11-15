import { openDB } from "../data/db.js";

import express from "express";
import {
  getProducts,
  getProductById,
  getCategories,
  updateStock
} from "../controllers/productController.js";

const router = express.Router();

router.get("/", getProducts);               // all products
router.get("/categories", getCategories);   // list of categories/subcategories
router.get("/:id", getProductById);         // single product
router.put("/:id/stock", updateStock);      // update stock count

// 🟢 Get stock for a specific product
router.get("/:id/stock", async (req, res) => {
  const { id } = req.params;
  try {
    const db = await openDB();
    const product = await db.get(
      "SELECT id, name, stock FROM products WHERE id = ?",
      [id]
    );
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    console.error("Error fetching stock:", error);
    res.status(500).json({ message: "Database error" });
  }
});


export default router;
