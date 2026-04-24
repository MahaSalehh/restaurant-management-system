import React, { useState, useEffect } from "react";
import { cartAPI, STORAGE_URL } from "../../service/api";
import { useAsync } from "../../hooks/useAsync";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../context/ToastContext";
import Loader from "../../components/Loader";
import { FaXmark } from "react-icons/fa6";

const Cart = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [actionLoading, setActionLoading] = useState(false);

  const {
    data,
    loading,
    execute: fetchCart,
  } = useAsync(cartAPI.getCart);


  const [cartState, setCartState] = useState([]);

  useEffect(() => {
    if (data?.data?.cart_items) {
      setCartState(data.data.cart_items);
    }
  }, [data]);

  const cartItems = cartState;
const updateQty = async (id, qty) => {
  if (qty < 1) return;

  setCartState((prev) =>
    prev.map((item) =>
      item.id === id ? { ...item, quantity: qty } : item
    )
  );

  try {
    await cartAPI.updateItem(id, { quantity: qty });

    showToast("success", "Quantity updated");
  } catch {
    showToast("error", "Failed to update item");

    fetchCart();
  }
};

  const removeItem = async (id) => {
  const old = cartState;

  setCartState((prev) =>
    prev.filter((item) => item.id !== id)
  );

  try {
    await cartAPI.removeItem(id);

    showToast("success", "Item removed");
  } catch {
    showToast("error", "Failed to remove item");

    setCartState(old);
  }
};

  const clearCart = async () => {
  const old = cartState;

  setCartState([]);

  try {
    await cartAPI.clearCart();

    showToast("success", "Cart cleared");
  } catch {
    showToast("error", "Failed to clear cart");

    setCartState(old);
  }
};

  const subtotal = cartItems.reduce(
    (sum, item) =>
      sum + (item.menu_item?.price || 0) * item.quantity,
    0
  );

  const deliveryFee = subtotal > 0 ? 0 : 0;
  const total = subtotal + deliveryFee;

  if (loading)
    return <Loader />

  return (
    <section className="cart-page">
      <div className="cart-container">
        <div className="cart-header">
          <div>
            <h2 className="h2">Your Cart</h2>
            <p>{cartItems.length} items</p>
          </div>

          {cartItems.length > 0 && (
            <button
              className="clear-btn"
              onClick={clearCart}
              disabled={actionLoading}
            >
              Clear Cart
            </button>
          )}
        </div>

        {cartItems.length === 0 ? (
          <div className="cart-empty">
            <h3 className="h3">Your cart is empty</h3>

            <button onClick={() => navigate("/menu")}>
              Browse Menu
            </button>
          </div>
        ) : (
          <div className="cart-layout justify-content-center">

            <div className="cart-items">
              {cartItems.map((item) => {
                const price = item.menu_item?.price || 0;
                const qty = item.quantity;
                const itemTotal = Number((price * qty)).toFixed(2);
                return (
                  <div className="cart-card" key={item.id}>

                    <img
                      src={
                        item.menu_item?.image_url?.startsWith("http")
                          ? item.menu_item.image_url
                          : STORAGE_URL + item.menu_item?.image_url
                      }
                      alt={item.menu_item?.name}
                    />

                    <div className="cart-details">
                      <h5>{item.menu_item?.name}</h5>

                      <p className="muted">
                        ${price} <FaXmark /> {qty}
                      </p>

                      <div className="qty-box">
                        <button
                          onClick={() => updateQty(item.id, qty - 1)}
                        >
                          -
                        </button>

                        <span>{qty}</span>

                        <button
                          onClick={() => updateQty(item.id, qty + 1)}
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="cart-right">
                      <strong>${itemTotal}</strong>

                      <button
                        className="remove"
                        onClick={() => removeItem(item.id)}
                      >
                        <FaXmark /> 
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>

            <div className="cart-summary">
              <div className="summary-card">

                <h5>Summary</h5>

                <div className="row-line">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>

                <div className="row-line">
                  <span>Delivery</span>
                  <span>${deliveryFee.toFixed(2)}</span>
                </div>
                <div className="row-line">
                  <span>{" "}</span>
                  <span style={{color: "#0f9447"}}>Free delivery for now!</span>

                  </div>

                <div className="row-line total">
                  <span>Total</span>
                  <strong>${total.toFixed(2)}</strong>
                </div>

                <button
                  className="checkout-btn"
                  onClick={() => navigate("/checkout")}
                >
                  Checkout →
                </button>

              </div>
            </div>

          </div>
        )}
      </div>
    </section>
  );
};

export default Cart;