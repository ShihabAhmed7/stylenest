import { http } from "./http";

// Creates an order from the current cart items
// cartItems shape: [{ id, qty, price, name, ... }]
export async function createOrder(cartItems) {
  const payload = {
    items: cartItems.map((x) => ({ id: x.id, qty: x.qty })),
  };

  const res = await http.post("/orders", payload);
  return res.data; // { id, total, status, created_at }
}
