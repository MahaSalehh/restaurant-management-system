import { useState } from "react";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import bg from "../../assets/auth.png";

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await login(formData);

      if (result.success) {
        showToast("success", "Welcome back");
        navigate("/dashboard");
      } else {
        showToast("error", result.error || "Login failed");
      }
    } catch (err) {
      showToast(
        "error",
        err.response?.data?.message || "Unexpected error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      
      navigate("/");
    }
  };

  return (
      <section className="auth-container d-flex align-items-center">
  <Container fluid>
    <Row className="g-0 min-vh-100">

      {/* LEFT FORM */}
      <Col
        md={6}
        className="d-flex align-items-center justify-content-center position-relative"
      >
        <Button
          className="back-btn"
          onClick={handleBack}
          variant="light"
        >
          ← Back
        </Button>

        <div className="auth-box">

          <div className="auth-header">
            <h2 className="h2">Welcome back!</h2>
            <p className="body-sm neutral5">
              Enter your credentials to access your account
            </p>
          </div>

          <Form onSubmit={handleSubmit} className="auth-form">

  <div className="input-group-custom mb-3">
    <Form.Control
      className="auth-input"
      type="email"
      name="email"
      placeholder=" "
      value={formData.email}
      onChange={handleChange}
      required
    />
    <label>Email</label>
  </div>

  <div className="input-group-custom mb-4">
    <Form.Control
      className="auth-input"
      type="password"
      name="password"
      placeholder=" "
      minLength={8}
      value={formData.password}
      onChange={handleChange}
      required
    />
    <label>Password</label>
  </div>

  <Button
    type="submit"
    className="auth-btn"
    disabled={loading}
  >
    {loading ? "Signing in..." : "Sign In"}
  </Button>

</Form>
<div className="text-center mt-4">
            <span className="text-muted">
              Don't have an account?{" "}
            </span>

            <Link to="/register" className="auth-link">
              Sign Up
            </Link>
          </div>

        </div>
      </Col>

      {/* RIGHT IMAGE */}
      <Col
        md={6}
        className="image-side d-none d-md-block"
        style={{ backgroundImage: `url(${bg})` }}
      />

    </Row>
  </Container>
</section>
  );
}

export default Login;