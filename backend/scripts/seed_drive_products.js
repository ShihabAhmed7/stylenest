// scripts/seed_drive_products.js
// Bulk insert products into SQLite (using Google Drive thumbnail links).
// Safe to re-run: it will SKIP products that already exist with the same image URL.

const dotenv = require("dotenv");
const Database = require("better-sqlite3");
const crypto = require("crypto");

dotenv.config();

const dbPath = process.env.DB_PATH || "./db.sqlite";
const db = new Database(dbPath);

function ensureTables() {
  // In case you run this before server has created tables
  db.exec(`
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
  `);
}

const products = [
  {
    name: "Classic Everyday Tee",
    category: "Tops",
    price: 19.9,
    image:
      "https://drive.google.com/thumbnail?id=1uS_URmtFCF3PVMliIJkWRtUb7eccTFxl&sz=w1200",
    description: "Soft, breathable tee with a clean fit—perfect for daily wear.",
  },
  {
    name: "Minimal Cotton Hoodie",
    category: "Tops",
    price: 49.0,
    image:
      "https://drive.google.com/thumbnail?id=1nG62gzsshTpmc-AdcjWU5Ha2C1x37Gy8&sz=w1200",
    description: "Comfort-first hoodie with a simple look and cozy feel.",
  },
  {
    name: "Relaxed Fit Shirt",
    category: "Tops",
    price: 34.5,
    image:
      "https://drive.google.com/thumbnail?id=1OJDyF1M2vOEvjtvmOsFMgyYp6L51Gz4K&sz=w1200",
    description: "A clean everyday shirt—easy to style for work or weekend.",
  },
  {
    name: "Light Knit Sweater",
    category: "Tops",
    price: 42.0,
    image:
      "https://drive.google.com/thumbnail?id=1f-GtQhQFxPL6NFtTAV8qXm9g9C6v0kQG&sz=w1200",
    description: "Lightweight knit with a modern shape—great for layering.",
  },
  {
    name: "Straight Denim Jeans",
    category: "Bottoms",
    price: 59.0,
    image:
      "https://drive.google.com/thumbnail?id=1dc0jXH21q2Q1zn4vvgvSjuQzYrvvwvup&sz=w1200",
    description: "Classic straight-cut denim with a comfortable everyday fit.",
  },
  {
    name: "Relaxed Chinos",
    category: "Bottoms",
    price: 45.0,
    image:
      "https://drive.google.com/thumbnail?id=1GnA-NQZqHQarpf-UZHg51jZ-5EivHHLW&sz=w1200",
    description: "Relaxed chinos that look clean but feel easy all day.",
  },
  {
    name: "Everyday Joggers",
    category: "Bottoms",
    price: 39.9,
    image:
      "https://drive.google.com/thumbnail?id=1hkPxK6O9n8g6TgI9BnnxTWKAaFoGuxiS&sz=w1200",
    description: "Soft joggers for comfort—home, errands, or casual days out.",
  },
  {
    name: "Summer Pleated Skirt",
    category: "Bottoms",
    price: 32.0,
    image:
      "https://drive.google.com/thumbnail?id=1wyML8PUx5GWTIWT4vLwZFXHopBuNUn_e&sz=w1200",
    description: "Light pleated skirt with an easy silhouette and smooth drape.",
  },
  {
    name: "City Walk Sneakers",
    category: "Shoes",
    price: 69.0,
    image:
      "https://drive.google.com/thumbnail?id=1KSVKLjua7vOMpLoEyxm4yzPxiSwuy4hb&sz=w1200",
    description: "Comfortable everyday sneakers with a clean, modern look.",
  },
  {
    name: "Minimal White Trainers",
    category: "Shoes",
    price: 74.0,
    image:
      "https://drive.google.com/thumbnail?id=1TKAv1yHHnh-ILdDz_ehdJ0EYEkumGV_g&sz=w1200",
    description: "Simple trainers that pair with everything—light and versatile.",
  },
  {
    name: "Casual Slip-On Shoes",
    category: "Shoes",
    price: 54.0,
    image:
      "https://drive.google.com/thumbnail?id=14__Qm4gR5H8cIHZP9WKMaUVEmtjNoALA&sz=w1200",
    description:
      "Easy slip-ons for quick everyday wear—comfort and style combined.",
  },
  {
    name: "Classic Leather Belt",
    category: "Accessories",
    price: 18.5,
    image:
      "https://drive.google.com/thumbnail?id=1cif2acTQGN4zc1eyLorSp5Ytsz_LuLvq&sz=w1200",
    description: "Simple belt with a clean buckle—great for jeans or chinos.",
  },
  {
    name: "Canvas Tote Bag",
    category: "Accessories",
    price: 22.5,
    image:
      "https://drive.google.com/thumbnail?id=1_C1iMdOd3edHmm3rsRYmFNys5FKw7Ui_&sz=w1200",
    description: "A sturdy everyday tote for essentials—simple and practical.",
  },
  {
    name: "Minimal Crossbody Bag",
    category: "Accessories",
    price: 29.9,
    image:
      "https://drive.google.com/thumbnail?id=1UmRKqWs67MgRZU6zNIfeQPJe6BsiAmbt&sz=w1200",
    description:
      "Compact crossbody bag for daily use—phone, wallet, keys, done.",
  },
  {
    name: "Everyday Cap",
    category: "Accessories",
    price: 16.9,
    image:
      "https://drive.google.com/thumbnail?id=1dkvS47uuHHC2u6fhn4n18P9b2uqppiAR&sz=w1200",
    description:
      "Light cap with a clean look—easy finishing touch for any outfit.",
  },
];

function seed() {
  ensureTables();

  // Ensure categories exist (nice for your admin dropdown)
  const insertCat = db.prepare(
    "INSERT OR IGNORE INTO categories (id, name) VALUES (?, ?)"
  );
  const uniqueCats = [...new Set(products.map((p) => p.category))];
  for (const c of uniqueCats) {
    insertCat.run(crypto.randomUUID(), c);
  }

  // Skip if same image already exists (so re-run doesn't duplicate)
  const existsByImage = db.prepare("SELECT 1 FROM products WHERE image = ?");

  const insertProduct = db.prepare(`
    INSERT INTO products (id, name, category, price, image, description)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const tx = db.transaction(() => {
    let inserted = 0;
    let skipped = 0;

    for (const p of products) {
      const exists = existsByImage.get(p.image);
      if (exists) {
        skipped++;
        continue;
      }

      const id = "p-" + crypto.randomUUID().slice(0, 8);
      insertProduct.run(
        id,
        p.name.trim(),
        p.category.trim(),
        Number(p.price),
        p.image.trim(),
        p.description.trim()
      );
      inserted++;
    }

    return { inserted, skipped, total: products.length };
  });

  const result = tx();
  console.log("✅ Drive seed done:", result);
  console.log(`DB: ${dbPath}`);
}

seed();
