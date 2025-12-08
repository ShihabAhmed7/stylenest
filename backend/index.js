const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const Database = require("better-sqlite3");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

dotenv.config();

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
  })
);

const db = new Database(process.env.DB_PATH || "./db.sqlite");
const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_change_me";

/* ----------------- DB INIT + SEED ----------------- */
function initDb() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL UNIQUE
    );

    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      price REAL NOT NULL,
      image TEXT NOT NULL,
      description TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      total REAL NOT NULL,
      status TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS order_items (
      id TEXT PRIMARY KEY,
      order_id TEXT NOT NULL,
      product_id TEXT NOT NULL,
      qty INTEGER NOT NULL,
      unit_price REAL NOT NULL,
      FOREIGN KEY(order_id) REFERENCES orders(id)
    );
  `);

  // Seed admin user
  const adminExists = db
    .prepare("SELECT 1 FROM users WHERE role='admin' LIMIT 1")
    .get();

  if (!adminExists) {
    const id = crypto.randomUUID();
    const email = "admin@stylenest.local";
    const password_hash = bcrypt.hashSync("admin123", 10);
    db.prepare(
      "INSERT INTO users (id, email, password_hash, role) VALUES (?, ?, ?, ?)"
    ).run(id, email, password_hash, "admin");
    console.log("✅ Seeded admin user: admin@stylenest.local / admin123");
  }

  // Seed categories (only if empty)
  const catCount = db.prepare("SELECT COUNT(*) as c FROM categories").get().c;
  if (catCount === 0) {
    const cats = ["Tops", "Bottoms", "Shoes", "Accessories"];
    const insertCat = db.prepare(
      "INSERT INTO categories (id, name) VALUES (?, ?)"
    );
    const tx = db.transaction(() => {
      for (const name of cats) insertCat.run(crypto.randomUUID(), name);
    });
    tx();
    console.log("✅ Seeded categories");
  }

  // Seed products (only if empty)
  const prodCount = db.prepare("SELECT COUNT(*) as c FROM products").get().c;
  if (prodCount === 0) {
    const seed = [
      {
        id: "p-101",
        name: "Everyday Tee",
        category: "Tops",
        price: 19.9,
        image:
          "https://images.unsplash.com/photo-1520975958225-9e2f2a2a9c12?auto=format&fit=crop&w=1200&q=80",
        description:
          "Soft cotton tee with a clean fit. Easy to wear daily, pairs with anything.",
      },
      {
        id: "p-102",
        name: "Minimal Hoodie",
        category: "Tops",
        price: 49.0,
        image:
          "https://images.unsplash.com/photo-1520975682030-1bb3f98435b1?auto=format&fit=crop&w=1200&q=80",
        description:
          "Warm, simple, and comfortable. Minimal branding, maximum comfort.",
      },
      {
        id: "p-201",
        name: "Straight Denim",
        category: "Bottoms",
        price: 59.0,
        image:
          "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=1200&q=80",
        description:
          "Classic straight-cut denim. Durable fabric and a timeless silhouette.",
      },
      {
        id: "p-202",
        name: "Relaxed Chinos",
        category: "Bottoms",
        price: 45.0,
        image:
          "https://images.unsplash.com/photo-1520975869018-6a2d0a2b57bf?auto=format&fit=crop&w=1200&q=80",
        description:
          "Comfortable relaxed chinos for work or weekend. Breathable and clean.",
      },
      {
        id: "p-301",
        name: "City Sneakers",
        category: "Shoes",
        price: 69.0,
        image:
          "https://images.unsplash.com/photo-1528701800489-20be3c6d2f48?auto=format&fit=crop&w=1200&q=80",
        description:
          "Lightweight everyday sneakers with a modern shape and flexible sole.",
      },
      {
        id: "p-401",
        name: "Canvas Tote",
        category: "Accessories",
        price: 22.5,
        image:
          "https://images.unsplash.com/photo-1520974959999-4b1b6f3c8d52?auto=format&fit=crop&w=1200&q=80",
        description:
          "A simple tote for daily essentials. Strong straps, minimal design.",
      },
    ];

    const insert = db.prepare(`
      INSERT INTO products (id, name, category, price, image, description)
      VALUES (@id, @name, @category, @price, @image, @description)
    `);

    const tx = db.transaction((rows) => {
      for (const row of rows) insert.run(row);
    });

    tx(seed);
    console.log("✅ Seeded products into SQLite");
  }

  // Seed demo orders (optional, only if empty)
  const orderCount = db.prepare("SELECT COUNT(*) as c FROM orders").get().c;
  if (orderCount === 0) {
    const now = new Date().toISOString();
    const o1 = { id: "o-1001", total: 88.9, status: "PENDING", created_at: now };
    const o2 = { id: "o-1002", total: 49.0, status: "DISPATCHED", created_at: now };
    const o3 = { id: "o-1003", total: 19.9, status: "READY", created_at: now };

    db.prepare("INSERT INTO orders (id, total, status, created_at) VALUES (?, ?, ?, ?)")
      .run(o1.id, o1.total, o1.status, o1.created_at);
    db.prepare("INSERT INTO orders (id, total, status, created_at) VALUES (?, ?, ?, ?)")
      .run(o2.id, o2.total, o2.status, o2.created_at);
    db.prepare("INSERT INTO orders (id, total, status, created_at) VALUES (?, ?, ?, ?)")
      .run(o3.id, o3.total, o3.status, o3.created_at);

    const insertItem = db.prepare(`
      INSERT INTO order_items (id, order_id, product_id, qty, unit_price)
      VALUES (?, ?, ?, ?, ?)
    `);

    insertItem.run(crypto.randomUUID(), o1.id, "p-301", 1, 69.0);
    insertItem.run(crypto.randomUUID(), o1.id, "p-401", 1, 22.5);
    insertItem.run(crypto.randomUUID(), o2.id, "p-102", 1, 49.0);
    insertItem.run(crypto.randomUUID(), o3.id, "p-101", 1, 19.9);

    console.log("✅ Seeded demo orders");
  }
}
initDb();

/* ----------------- AUTH MIDDLEWARE ----------------- */
function requireAdmin(req, res, next) {
  const auth = req.headers.authorization || "";
  if (!auth.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing token" });
  }

  const token = auth.slice("Bearer ".length);
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    if (payload.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }
    req.user = payload;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
}

/* ----------------- PUBLIC ROUTES ----------------- */
app.get("/api/health", (req, res) => res.json({ ok: true }));

app.get("/api/products", (req, res) => {
  const rows = db.prepare("SELECT * FROM products").all();
  res.json(rows);
});

app.get("/api/products/:id", (req, res) => {
  const row = db.prepare("SELECT * FROM products WHERE id = ?").get(req.params.id);
  if (!row) return res.status(404).json({ message: "Product not found" });
  res.json(row);
});

/**
 * ✅ REAL CHECKOUT:
 * Create an order from cart items and store it in SQLite.
 * Body: { items: [{ id: "p-101", qty: 2 }, ...] }
 * Returns: { id, total, status, created_at }
 */
app.post("/api/orders", (req, res) => {
  const { items } = req.body || {};

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: "Cart items required" });
  }

  for (const it of items) {
    if (!it?.id || !Number.isInteger(it.qty) || it.qty < 1) {
      return res.status(400).json({ message: "Invalid items format" });
    }
  }

  const tx = db.transaction(() => {
    let total = 0;

    const productStmt = db.prepare("SELECT id, price FROM products WHERE id=?");
    const orderId = "o-" + crypto.randomUUID().slice(0, 8);
    const createdAt = new Date().toISOString();

    // Insert order first with total=0, then update after computing
    db.prepare(
      "INSERT INTO orders (id, total, status, created_at) VALUES (?, ?, ?, ?)"
    ).run(orderId, 0, "PENDING", createdAt);

    const insertItem = db.prepare(`
      INSERT INTO order_items (id, order_id, product_id, qty, unit_price)
      VALUES (?, ?, ?, ?, ?)
    `);

    for (const it of items) {
      const p = productStmt.get(it.id);
      if (!p) throw new Error(`Product not found: ${it.id}`);

      total += p.price * it.qty;
      insertItem.run(crypto.randomUUID(), orderId, p.id, it.qty, p.price);
    }

    db.prepare("UPDATE orders SET total=? WHERE id=?").run(total, orderId);

    return { id: orderId, total, status: "PENDING", created_at: createdAt };
  });

  try {
    const order = tx();
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ message: err.message || "Failed to create order" });
  }
});

/* ----------------- ADMIN AUTH ----------------- */
app.post("/api/auth/admin/login", (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ message: "Missing fields" });

  const user = db.prepare("SELECT * FROM users WHERE email = ? LIMIT 1").get(email);
  if (!user || user.role !== "admin") return res.status(401).json({ message: "Invalid credentials" });

  const ok = bcrypt.compareSync(password, user.password_hash);
  if (!ok) return res.status(401).json({ message: "Invalid credentials" });

  const token = jwt.sign(
    { sub: user.id, role: "admin", email: user.email },
    JWT_SECRET,
    { expiresIn: "8h" }
  );

  res.json({ token, admin: { id: user.id, email: user.email } });
});

/* ----------------- ADMIN METRICS ----------------- */
app.get("/api/admin/metrics", requireAdmin, (req, res) => {
  const productsCount = db.prepare("SELECT COUNT(*) as c FROM products").get().c;
  const categoriesCount = db.prepare("SELECT COUNT(*) as c FROM categories").get().c;

  const ordersPending = db.prepare("SELECT COUNT(*) as c FROM orders WHERE status='PENDING'").get().c;
  const ordersDispatched = db.prepare("SELECT COUNT(*) as c FROM orders WHERE status='DISPATCHED'").get().c;
  const ordersReady = db.prepare("SELECT COUNT(*) as c FROM orders WHERE status='READY'").get().c;

  const totalSales = db.prepare("SELECT COALESCE(SUM(total), 0) as s FROM orders").get().s;

  res.json({
    productsCount,
    categoriesCount,
    ordersPending,
    ordersDispatched,
    ordersReady,
    totalSales,
  });
});

/* ----------------- ADMIN PRODUCTS CRUD ----------------- */
app.get("/api/admin/products", requireAdmin, (req, res) => {
  res.json(db.prepare("SELECT * FROM products ORDER BY name").all());
});

app.post("/api/admin/products", requireAdmin, (req, res) => {
  const { name, category, price, image, description } = req.body || {};
  if (!name || !category || !image || !description) {
    return res.status(400).json({ message: "Missing fields" });
  }

  const id = "p-" + crypto.randomUUID().slice(0, 8);

  db.prepare(`
    INSERT INTO products (id, name, category, price, image, description)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(id, name.trim(), category.trim(), Number(price), image.trim(), description.trim());

  res.status(201).json({ id });
});

app.put("/api/admin/products/:id", requireAdmin, (req, res) => {
  const { name, category, price, image, description } = req.body || {};
  const id = req.params.id;

  const existing = db.prepare("SELECT 1 FROM products WHERE id=?").get(id);
  if (!existing) return res.status(404).json({ message: "Not found" });

  db.prepare(`
    UPDATE products
    SET name=?, category=?, price=?, image=?, description=?
    WHERE id=?
  `).run(name.trim(), category.trim(), Number(price), image.trim(), description.trim(), id);

  res.json({ ok: true });
});

app.delete("/api/admin/products/:id", requireAdmin, (req, res) => {
  db.prepare("DELETE FROM products WHERE id=?").run(req.params.id);
  res.json({ ok: true });
});

/* ----------------- ADMIN CATEGORIES CRUD ----------------- */
app.get("/api/admin/categories", requireAdmin, (req, res) => {
  res.json(db.prepare("SELECT * FROM categories ORDER BY name").all());
});

app.post("/api/admin/categories", requireAdmin, (req, res) => {
  const { name } = req.body || {};
  if (!name || !name.trim()) return res.status(400).json({ message: "Name required" });

  try {
    const id = crypto.randomUUID();
    db.prepare("INSERT INTO categories (id, name) VALUES (?, ?)").run(id, name.trim());
    res.status(201).json({ id });
  } catch {
    res.status(409).json({ message: "Category already exists" });
  }
});

app.delete("/api/admin/categories/:id", requireAdmin, (req, res) => {
  db.prepare("DELETE FROM categories WHERE id=?").run(req.params.id);
  res.json({ ok: true });
});

/* ----------------- ADMIN ORDERS ----------------- */
app.get("/api/admin/orders", requireAdmin, (req, res) => {
  const status = req.query.status;
  const where = status && status !== "ALL" ? "WHERE o.status=?" : "";

  const rows =
    status && status !== "ALL"
      ? db
          .prepare(
            `
        SELECT
          o.*,
          (SELECT COALESCE(SUM(qty),0) FROM order_items oi WHERE oi.order_id=o.id) as item_count
        FROM orders o
        ${where}
        ORDER BY o.created_at DESC
      `
          )
          .all(status)
      : db
          .prepare(
            `
        SELECT
          o.*,
          (SELECT COALESCE(SUM(qty),0) FROM order_items oi WHERE oi.order_id=o.id) as item_count
        FROM orders o
        ORDER BY o.created_at DESC
      `
          )
          .all();

  res.json(rows);
});

app.patch("/api/admin/orders/:id/status", requireAdmin, (req, res) => {
  const { status } = req.body || {};
  const allowed = ["PENDING", "DISPATCHED", "READY"];
  if (!allowed.includes(status)) return res.status(400).json({ message: "Bad status" });

  const id = req.params.id;
  const existing = db.prepare("SELECT 1 FROM orders WHERE id=?").get(id);
  if (!existing) return res.status(404).json({ message: "Order not found" });

  db.prepare("UPDATE orders SET status=? WHERE id=?").run(status, id);
  res.json({ ok: true });
});

/* ----------------- START ----------------- */
const port = Number(process.env.PORT || 5000);
app.listen(port, () => {
  console.log(`✅ API running: http://localhost:${port}/api`);
});
