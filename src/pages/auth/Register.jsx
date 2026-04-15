import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
} from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import bg from "../../assets/auth.png";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
const isMatch = formData.password === formData.confirmPassword;
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      showToast("error", "Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        password_confirmation: formData.confirmPassword,
      };

      const result = await register(payload);

      if (result.success) {
        showToast("success", "Account created successfully");

        setTimeout(() => {
          navigate("/login");
        }, 1200);
      } else {
        showToast("error", result.error || "Registration failed");
      }
    } catch (err) {
      showToast(
        "error",
        err.response?.data?.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => navigate(-1);

  return (
    <section className="min-vh-100 d-flex align-items-center auth-container">
  <Container fluid>
    <Row className="vh-100 g-0">

      {/* LEFT SIDE */}
      <Col
        md={6}
        className="d-flex align-items-center justify-content-center position-relative"
      >
        <Button
          variant="light"
          onClick={handleBack}
          className="back-btn"
        >
          ← Back
        </Button>

        <div className="form-wrapper w-100" style={{ maxWidth: "420px" }}>

          <h2 className="mb-4 text-center">Get Started Now</h2>

          <Form onSubmit={handleSubmit}>

  <div className="input-group-custom mb-2">
    <Form.Control
      type="text"
      name="name"
      className="auth-input"
      placeholder=" "
      minLength={3}
      value={formData.name}
      onChange={handleChange}
      required
    />
    <label>Name</label>
  </div>

  <div className="input-group-custom mb-2">
    <Form.Control
      type="email"
      name="email"
      className="auth-input"
      placeholder=" "
      value={formData.email}
      onChange={handleChange}
      required
    />
    <label>Email</label>
  </div>

  <div className="input-group-custom mb-2">
    <Form.Control
      type="text"
      name="phone"
      className="auth-input"
      placeholder=" "
      pattern="[0-9]{11}"
      value={formData.phone}
      onChange={handleChange}
      required
    />
    <label>Phone</label>
  </div>

  <div className="input-group-custom mb-2">
    <Form.Control
      type="password"
      name="password"
      className="auth-input"
      placeholder=" "
      minLength={8}
      value={formData.password}
      onChange={handleChange}
      required
    />
    <label>Password</label>
  </div>

  <div className="input-group-custom mb-3">
    <Form.Control
      type="password"
      name="confirmPassword"
      className={`auth-input ${
        formData.confirmPassword
          ? isMatch
            ?  "match" : "no-match" : ""
      }`}
      placeholder=" "
      minLength={8}
      value={formData.confirmPassword}
      onChange={handleChange}
      required
    />
    <label>Confirm Password</label>
  </div>

  <Form.Group className="mb-3">
    <Form.Check
      type="checkbox"
      label="I agree to the terms & policies"
      required
    />
  </Form.Group>

  <Button
    type="submit"
    className="w-100 auth-btn"
    disabled={loading}
  >
    {loading ? "Creating Account..." : "Sign Up"}
  </Button>

</Form>

          <div className="text-center mt-4">
            <span className="text-muted">
              Already have an account?{" "}
            </span>

            <Link to="/login" className="auth-link">
              Sign In
            </Link>
          </div>

        </div>
      </Col>

      {/* RIGHT SIDE */}
      <Col
        md={6}
        className="image-side d-none d-md-block p-0"
        style={{ backgroundImage: `url(${bg})` }}
      />

    </Row>
  </Container>
</section>
  );
};

export default Register;