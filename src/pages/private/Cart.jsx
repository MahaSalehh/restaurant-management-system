import React, { useState } from "react";
import { cartAPI, STORAGE_URL } from "../../service/api";
import { useAsync } from "../../hooks/useAsync";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import { useToast } from "../../context/ToastContext";

const Cart = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [actionLoading, setActionLoading] = useState(false);

  // ================= FETCH CART =================
  const {
    data,
    loading,
    execute: fetchCart,
  } = useAsync(cartAPI.getCart);

  const cartItems = data?.data?.cart_items || [];

  // ================= UPDATE QTY =================
  const updateQty = async (id, qty) => {
    if (qty < 1) return;

    try {
      setActionLoading(true);

      await cartAPI.updateItem(id, { quantity: qty });

      showToast("success", "Cart updated");
      fetchCart();

    } catch {
      showToast("error", "Failed to update item");
    } finally {
      setActionLoading(false);
    }
  };

  // ================= REMOVE ITEM =================
  const removeItem = async (id) => {
    try {
      setActionLoading(true);

      await cartAPI.removeItem(id);

      showToast("success", "Item removed");
      fetchCart();

    } catch {
      showToast("error", "Failed to remove item");
    } finally {
      setActionLoading(false);
    }
  };

  // ================= CLEAR CART =================
  const clearCart = async () => {
    try {
      setActionLoading(true);

      await cartAPI.clearCart();

      showToast("success", "Cart cleared");
      fetchCart();

    } catch {
      showToast("error", "Failed to clear cart");
    } finally {
      setActionLoading(false);
    }
  };

  // ================= CALCULATIONS =================
  const subtotal = cartItems.reduce(
    (sum, item) =>
      sum + (item.menu_item?.price || 0) * item.quantity,
    0
  );

  const deliveryFee = subtotal > 0 ? 25 : 0;
  const total = subtotal + deliveryFee;

  // ================= LOADING =================
  if (loading)
    return <div className="text-center body-md py-5">Loading...</div>;

  return (
    <section className="cart-page py-5 bg-light-section">

      <div className="container">

        {/* HEADER */}
        <div className="cart-top mb-4">

          <div>
            <h2 className="h2">Your Cart 🛒</h2>
            <p className="body-sm neutral5">
              {cartItems.length} items in your cart
            </p>
          </div>

          {cartItems.length > 0 && (
            <button
              className="clear-link"
              onClick={clearCart}
              disabled={actionLoading}
            >
              Clear all
            </button>
          )}

        </div>

        {/* EMPTY */}
        {cartItems.length === 0 ? (
          <div className="cart-empty">
            <h3 className="h3">Your cart is empty</h3>

            <Button
              onClick={() => navigate("/menu")}
            >
              Browse Menu
            </Button>
          </div>
        ) : (
          <div className="row g-4">

            {/* ITEMS */}
            <div className="col-lg-8">

              <div className="cart-grid">

                {cartItems.map((item) => {
                  const price = item.menu_item?.price || 0;
                  const qty = item.quantity;
                  const subtotal = price * qty;

                  return (
                    <div className="cart-item" key={item.id}>

                      <img
                        src={
                          item.menu_item?.image_url?.startsWith("http")
                            ? item.menu_item.image_url
                            : STORAGE_URL + item.menu_item?.image_url
                        }
                        alt={item.menu_item?.name}
                      />

                      <div className="cart-info">

                        <h5>{item.menu_item?.name}</h5>

                        <div className="price-line">
                          <span>${price}</span>
                          <span>× {qty}</span>
                          <strong>${subtotal}</strong>
                        </div>

                        <div className="qty-control">

                          <button
                            onClick={() => updateQty(item.id, qty - 1)}
                            disabled={actionLoading}
                          >
                            -
                          </button>

                          <span>{qty}</span>

                          <button
                            onClick={() => updateQty(item.id, qty + 1)}
                            disabled={actionLoading}
                          >
                            +
                          </button>

                        </div>

                      </div>

                      <button
                        onClick={() => removeItem(item.id)}
                        disabled={actionLoading}
                      >
                        ✕
                      </button>

                    </div>
                  );
                })}

              </div>

            </div>

            {/* CHECKOUT */}
            <div className="col-lg-4">

              <div className="checkout-panel">

                <div className="checkout-body">

                  <div>
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>

                  <div>
                    <span>Delivery</span>
                    <span>${deliveryFee.toFixed(2)}</span>
                  </div>

                </div>

                <div className="checkout-total">
                  <strong>${total.toFixed(2)}</strong>
                </div>

                <button
                  onClick={() => navigate("/checkout")}
                >
                  Continue →
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