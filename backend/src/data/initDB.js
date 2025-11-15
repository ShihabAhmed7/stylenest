import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "path";

const dbPath = path.resolve("./src/data/stylenest.db");

const initDB = async () => {
  const db = await open({
    filename: dbPath,
    driver: sqlite3.Database,
  });

  // Drop old table if exists
  await db.exec(`DROP TABLE IF EXISTS products;`);

  // Create new table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      price REAL,
      image TEXT,
      category TEXT,
      subcategory TEXT,
      gender TEXT,
      stock INTEGER
    );
  `);

  // Insert sample realistic data
  await db.exec(`
  INSERT INTO products (name, price, image, category, subcategory, gender, stock) VALUES
  -- WOMEN DRESSES
  ('Classic Party Dress', 79.99, 'https://images.unsplash.com/photo-1520975940470-6c7e90f3d1c4?w=300', 'Dresses', 'Party', 'Women', 10),
  ('Formal Office Dress', 89.99, 'https://images.unsplash.com/photo-1583001808181-f3f4b902b6f3?w=300', 'Dresses', 'Formal', 'Women', 12),
  ('Casual Summer Dress', 59.99, 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=300', 'Dresses', 'Casual', 'Women', 8),

  -- MEN CLOTHING (use "Dresses" as category to reuse filters)
  ('Men’s Formal Blazer', 129.99, 'https://images.unsplash.com/photo-1528701800489-20be97e58d53?w=300', 'Dresses', 'Formal', 'Men', 7),
  ('Men’s Casual Shirt', 54.99, 'https://images.unsplash.com/photo-1589310235460-196cd5e8c45e?w=300', 'Dresses', 'Casual', 'Men', 9),

  -- CHILDREN CLOTHING
  ('Kids’ Colorful Outfit', 45.99, 'https://images.unsplash.com/photo-1520986606214-8b456906c813?w=300', 'Dresses', 'Casual', 'Children', 9),

  -- MEN SHOES
  ('Men’s Leather Boots', 99.99, 'https://images.unsplash.com/photo-1595341888016-a392ef81b7de?w=300', 'Shoes', 'Boots', 'Men', 15),
  ('Men’s Running Sneakers', 79.99, 'https://images.unsplash.com/photo-1600185365501-14fc09a5f6b4?w=300', 'Shoes', 'Sneakers', 'Men', 6),

  -- WOMEN SHOES
  ('Women’s Elegant Heels', 89.99, 'https://images.unsplash.com/photo-1612198791919-b2be2bdeed4b?w=300', 'Shoes', 'Sandals', 'Women', 5),
  ('Casual White Sneakers', 69.99, 'https://images.unsplash.com/photo-1600185365683-f6c21d9a4bd1?w=300', 'Shoes', 'Sneakers', 'Women', 10),

  -- CHILDREN SHOES
  ('Kids’ Summer Sandals', 49.99, 'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=300', 'Shoes', 'Sandals', 'Children', 12);
`);


  console.log("✅ SQLite database initialized with realistic product data");
  await db.close();
};

initDB();
