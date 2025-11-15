import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "path";

// Use same path as initDB
const dbPath = path.resolve("./src/data/stylenest.db");

// Function to open database (used in routes)
export async function openDB() {
  return open({
    filename: dbPath,
    driver: sqlite3.Database,
  });
}
