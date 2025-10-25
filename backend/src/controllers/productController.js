import fs from "fs";

export const getProducts = (req, res) => {
  fs.readFile("./src/data/products.json", "utf-8", (err, data) => {
    if (err) {
      return res.status(500).json({ message: "Error reading products file" });
    }
    const products = JSON.parse(data);
    res.json(products);
  });
};
