import React, { useEffect, useState } from "react";
import { cartAPI, orderAPI } from "../../service/api";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../context/ToastContext";
import { Form } from "react-bootstrap";
import Loader from "../../components/Loader";
import { FaXmark } from "react-icons/fa6";

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

    addressTouched: false,
    phoneTouched: false,
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

  const subtotal = cartItems.reduce(
    (sum, item) =>
      sum + (item.menu_item?.price || 0) * item.quantity,
    0
  );

  const deliveryFee = subtotal > 0 ? 0 : 0;
  const total = subtotal + deliveryFee;

  const handleBlur = (e) => {
    const { name } = e.target;

    setForm((prev) => ({
      ...prev,
      [`${name}Touched`]: true,
    }));
  };

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

  if (loading) return <Loader />;

  return (
    <section className="checkout-section">

      <div className="menu-container">

        <div className="checkout-header">
          <button
            variant="dark"
            onClick={handleBack}
            className="back-button btn-custom btn-outline-custom"
          >
            ← Back
          </button>

          <h2 className="h2 checkout-title">Checkout</h2>
        </div>

        <div className="row g-4">

          <div className="col-lg-7">

            <Form className="checkout-card" onSubmit={handleSubmit}>

              <Form.Group className="contact-field">
                <Form.Label>Address</Form.Label>

                <Form.Control
                  as="textarea"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  rows={3}
                  placeholder="Enter your address"
                  required
                  isInvalid={
                    form.addressTouched &&
                    form.address.trim().length === 0
                  }
                />

                <Form.Control.Feedback type="invalid">
                  Address is required
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="contact-field">
                <Form.Label>Phone</Form.Label>

                <Form.Control
                  name="phone"
                  value={form.phone}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      phone: e.target.value.replace(/\D/g, ""),
                    }))
                  }
                  onBlur={handleBlur}
                  placeholder="01XXXXXXXXX"
                  pattern="^01[0-9]{9}$"
                  maxLength={11}
                  required
                  isInvalid={
                    form.phoneTouched &&
                    !/^01[0-9]{9}$/.test(form.phone)
                  }
                />

                <Form.Control.Feedback type="invalid">
                  Phone must start with 01 and be 11 digits
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="contact-field">
                <Form.Label>Notes</Form.Label>

                <Form.Control
                  as="textarea"
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  rows={2}
                  placeholder="Optional notes..."
                />
              </Form.Group>

              <Form.Group className="contact-field">
                <Form.Label>Payment Method</Form.Label>

                <Form.Select
                  name="payment_method"
                  value={form.payment_method}
                  onChange={handleChange}
                >
                  <option value="cash">Cash</option>
                  <option value="card">Card</option>
                </Form.Select>
              </Form.Group>

              <button
                type="submit"
                className="contact-btn"
                disabled={submitting}>
                {submitting ? "Processing..." : "Place Order"}
              </button>

            </Form>

          </div>

          <div className="col-lg-5">

            <div className="checkout-summary">

              <h5>Order Summary</h5>

              {cartItems.map((item) => (
                <div className="summary-row" key={item.id}>
                  <span>
                    {item.menu_item?.name} <FaXmark /> {item.quantity}
                  </span>
                  <span>
                    ${Number(item.menu_item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}

              <hr />

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
                <span style={{ color: "#0f9447" }}>Free delivery for now!</span>
              </div>

              <div className="summary-total">

                <span>Total</span>
                <strong>${Number(total.toFixed(2))}</strong>
              </div>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
};

export default Checkout;