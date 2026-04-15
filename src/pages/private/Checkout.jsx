import React, { useEffect, useState } from "react";
import { cartAPI, orderAPI } from "../../service/api";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../context/ToastContext";

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

  // ================= FETCH CART =================
  const fetchCart = async () => {
    try {
      const res = await cartAPI.getCart();
      setCartItems(res.data?.data?.cart_items || []);
    } catch {
      showToast("error", "Failed to load cart");
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // ================= TOTAL =================
  const totalPrice = cartItems.reduce(
    (total, item) =>
      total + (item.menu_item?.price || 0) * item.quantity,
    0
  );

  // ================= FORM CHANGE =================
  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    // ❌ validation
    if (!form.address || !form.phone) {
      showToast("error", "Address and phone are required");
      return;
    }

    if (cartItems.length === 0) {
      showToast("error", "Your cart is empty");
      return;
    }

    setSubmitting(true);

    try {
      // ✅ FIXED payload bug
      const payload = {
        address: form.address,
        phone: form.phone,
        notes: form.notes,
        payment_method: form.payment_method,
      };

      await orderAPI.create(payload);

      showToast("success", "Order placed successfully 🎉");

      // optional UX reset
      setForm({
        address: "",
        phone: "",
        notes: "",
        payment_method: "cash",
      });

      navigate("/");

    } catch (err) {
      const msg =
        err.response?.data?.message ||
        "Something went wrong. Please try again.";

      showToast("error", msg);

    } finally {
      setSubmitting(false);
    }
  };

  // ================= LOADING =================
  if (loading)
    return <p className="text-center body-md py-5">Loading...</p>;

  return (
    <section className="py-5 bg-light-section">
      <div className="container">

        <h2 className="h2 mb-4 text-center">
          Checkout 🧾
        </h2>

        <div className="row g-4">

          {/* LEFT FORM */}
          <div className="col-lg-7">

            <form className="card-custom p-4" onSubmit={handleSubmit}>

              {/* ADDRESS */}
              <div className="form-group">
                <label>Address</label>
                <textarea
                  className="input-control"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  rows="3"
                  required
                />
              </div>

              {/* PHONE */}
              <div className="form-group">
                <label>Phone</label>
                <input
                  type="text"
                  className="input-control"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* NOTES */}
              <div className="form-group">
                <label>Notes (optional)</label>
                <textarea
                  className="input-control"
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  rows="2"
                />
              </div>

              {/* PAYMENT */}
              <div className="form-group">
                <label>Payment Method</label>
                <select
                  className="input-control"
                  name="payment_method"
                  value={form.payment_method}
                  onChange={handleChange}
                >
                  <option value="cash">Cash</option>
                  <option value="card">Card</option>
                </select>
              </div>

              {/* BUTTON */}
              <button
                className="btn btn-primary-custom w-100"
                disabled={submitting}
              >
                {submitting ? "Processing..." : "Place Order"}
              </button>

            </form>

          </div>

          {/* RIGHT SUMMARY */}
          <div className="col-lg-5">

            <div className="card-custom p-4">

              <h5 className="h3 mb-3">Order Summary</h5>

              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="d-flex justify-content-between body-sm mb-2"
                >
                  <span>
                    {item.menu_item?.name} × {item.quantity}
                  </span>

                  <span>
                    ${(item.menu_item?.price || 0) * item.quantity}
                  </span>
                </div>
              ))}

              <hr />

              <div className="d-flex justify-content-between body-md body-md-bold">
                <span>Total</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default Checkout;