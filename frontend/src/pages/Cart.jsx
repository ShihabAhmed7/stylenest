import "./Cart.css";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";

export default function Cart() {
  const { cartItems, removeFromCart, totalPrice, clearCart } = useCart();

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="page cart">
      <h2>Your Cart</h2>
      {totalItems > 0 && <h4>Total Items: {totalItems}</h4>}

      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <ul className="cart-list">
            {cartItems.map((item) => (
              <li key={item.id} className="cart-item">
                <img src={item.image} alt={item.name} />
                <div>
                  <h3>{item.name}</h3>
                  <p>Quantity: {item.quantity}</p>
                  <p>Price: €{(item.price * item.quantity).toFixed(2)}</p>
                </div>
                <button onClick={() => removeFromCart(item.id)}>Remove</button>
              </li>
            ))}
          </ul>

          <h3>Total: €{totalPrice.toFixed(2)}</h3>

          <div className="cart-actions">
            <button onClick={clearCart}>Clear Cart</button>
            <Link to="/checkout">
              <button>Proceed to Checkout</button>
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
