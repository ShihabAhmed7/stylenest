import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // 🟢 Add to Cart (increase quantity if item exists)
  const addToCart = (product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        // increase only that product’s quantity
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      // if new product, add with quantity 1
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  // 🔴 Remove from Cart (decrease quantity by 1 or remove if last)
  const removeFromCart = (id) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === id);
      if (!existing) return prev;

      if (existing.quantity === 1) {
        // remove product if quantity is 1
        return prev.filter((item) => item.id !== id);
      } else {
        // decrease quantity by 1
        return prev.map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        );
      }
    });
  };

  // 🧹 Clear all cart items
  const clearCart = () => setCartItems([]);

  // 💶 Calculate total price dynamically
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, clearCart, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
