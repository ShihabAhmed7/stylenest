import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import productRoutes from "./routes/productRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Root route
app.get("/", (req, res) => {
  res.send("StyleNest backend is running...");
});

// ✅ Health check route (for Render / monitoring)
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// API routes
app.use("/api/products", productRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
