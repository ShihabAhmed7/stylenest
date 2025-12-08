import React, { createContext, useContext, useMemo, useReducer } from "react";
import { loadJSON, saveJSON } from "../lib/storage.js";

const CartContext = createContext(null);

const STORAGE_KEY = "modern_shop_cart_v1";

/**
 * Cart item shape:
 * { id, name, price, image, category, qty }
 */
function cartReducer(state, action) {
  switch (action.type) {
    case "ADD": {
      const item = action.payload;
      const existing = state.items.find((x) => x.id === item.id);

      let nextItems;
      if (existing) {
        nextItems = state.items.map((x) =>
          x.id === item.id ? { ...x, qty: x.qty + 1 } : x
        );
      } else {
        nextItems = [...state.items, { ...item, qty: 1 }];
      }

      const next = { ...state, items: nextItems };
      saveJSON(STORAGE_KEY, next);
      return next;
    }

    case "REMOVE": {
      const id = action.payload;
      const nextItems = state.items.filter((x) => x.id !== id);
      const next = { ...state, items: nextItems };
      saveJSON(STORAGE_KEY, next);
      return next;
    }

    case "SET_QTY": {
      const { id, qty } = action.payload;
      const safeQty = Math.max(1, Math.min(99, qty)); // keep it reasonable
      const nextItems = state.items.map((x) =>
        x.id === id ? { ...x, qty: safeQty } : x
      );
      const next = { ...state, items: nextItems };
      saveJSON(STORAGE_KEY, next);
      return next;
    }

    case "CLEAR": {
      const next = { ...state, items: [] };
      saveJSON(STORAGE_KEY, next);
      return next;
    }

    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const initial = loadJSON(STORAGE_KEY, { items: [] });
  const [state, dispatch] = useReducer(cartReducer, initial);

  const api = useMemo(() => {
    const items = state.items;

    const count = items.reduce((sum, x) => sum + x.qty, 0);
    const subtotal = items.reduce((sum, x) => sum + x.price * x.qty, 0);

    return {
      items,
      count,
      subtotal,
      add(item) {
        dispatch({ type: "ADD", payload: item });
      },
      remove(id) {
        dispatch({ type: "REMOVE", payload: id });
      },
      setQty(id, qty) {
        dispatch({ type: "SET_QTY", payload: { id, qty } });
      },
      clear() {
        dispatch({ type: "CLEAR" });
      }
    };
  }, [state.items]);

  return <CartContext.Provider value={api}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider />");
  return ctx;
}
