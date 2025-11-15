import "./Checkout.css";
import { useCart } from "../context/CartContext";

export default function Checkout() {
  const { totalPrice, cartItems } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="page checkout">
        <h2>No items to checkout.</h2>
      </div>
    );
  }

  return (
    <div className="page checkout">
      <h2>Checkout</h2>
      <p>Your total is: €{totalPrice.toFixed(2)}</p>
      <p>Sorry, our payment system is being updated.</p>
      <p>We’ll be back soon with secure payment options!</p>
    </div>
  );
}
