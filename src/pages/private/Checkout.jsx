import React, { useEffect, useState } from "react";
import { cartAPI, orderAPI } from "../../service/api";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../context/ToastContext";
import { Button } from "react-bootstrap";
import Loader from "../../components/Loader";

const Checkout = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const { showToast } = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    address: "",
    phone: "",
    notes: "",
    payment_method: "cash",
  });

  const fetchCart = async () => {
    try {
      const res = await cartAPI.getCart();
      setCartItems(res.data?.data?.cart_items || []);
    } catch {
      showToast("error", "Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const totalPrice = cartItems.reduce(
    (t, i) => t + (i.menu_item?.price || 0) * i.quantity,
    0
  );

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.address || !form.phone) {
      showToast("error", "Address and phone are required");
      return;
    }

    setSubmitting(true);

    try {
      await orderAPI.create(form);

      showToast("success", "Order placed successfully 🎉");

      setForm({
        address: "",
        phone: "",
        notes: "",
        payment_method: "cash",
      });

      navigate("/");
    } catch (err) {
      showToast(
        "error",
        err.response?.data?.message || "Something went wrong"
      );
    } finally {
      setSubmitting(false);
    }
  };
  const handleBack = () => navigate(-1);

  if (loading)
    return <Loader />

  return (
    <section className="checkout-section">

      <div className="menu-container">
        <div className="checkout-header">
        <Button
          variant="dark"
          onClick={handleBack}
          className="back-button"
        >
          ← Back
        </Button>
        <h2 className="checkout-title">Checkout </h2>
</div>
        <div className="row g-4">

          <div className="col-lg-7">

            <form className="checkout-card" onSubmit={handleSubmit}>

              <div className="field">
                <label>Address</label>
                <textarea
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Enter your address"
                />
              </div>

              <div className="field">
                <label>Phone</label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="01XXXXXXXXX"
                />
              </div>

              <div className="field">
                <label>Notes</label>
                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  rows="2"
                  placeholder="Optional notes..."
                />
              </div>

              <div className="field">
                <label>Payment Method</label>
                <select
                  name="payment_method"
                  value={form.payment_method}
                  onChange={handleChange}
                >
                  <option value="cash">Cash</option>
                  <option value="card">Card</option>
                </select>
              </div>

              <button className="contact-btn" disabled={submitting}>
                {submitting ? "Processing..." : "Place Order"}
              </button>

            </form>

          </div>

          <div className="col-lg-5">
            <div className="checkout-summary">
              <h5>Order Summary</h5>
              {cartItems.map((item) => (
                <div className="summary-row" key={item.id}>
                  <span>
                    {item.menu_item?.name} × {item.quantity}
                  </span>
                  <span>
                    ${(item.menu_item?.price || 0) * item.quantity}
                  </span>
                </div>
              ))}

              <hr />

              <div className="summary-total">
                <span>Total</span>
                <strong>${totalPrice.toFixed(2)}</strong>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default Checkout;