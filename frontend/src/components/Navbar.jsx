import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "./Navbar.css";

export default function Navbar() {
  const { cartItems } = useCart();

  // Calculate total number of items (including quantity)
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="navbar">
      <h1 className="logo">
        <Link to="/">StyleNest</Link>
      </h1>
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/products">Products</Link></li>
        <li>
          <Link to="/cart">
            Cart ({totalItems})
          </Link>
        </li>
      </ul>
    </nav>
  );
}
