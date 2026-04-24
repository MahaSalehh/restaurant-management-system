import { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import bg from "../../assets/auth.png";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    emailTouched: false,
    passwordTouched: false,
  });

  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);


  const handleBlur = (e) => {
    const { name } = e.target;

    setFormData((prev) => ({
      ...prev,
      [`${name}Touched`]: true,
    }));
  };

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
    navigate("/");
  };

  return (
    <section className="auth-container d-flex align-items-center">
      <Container fluid>
        <Row className="g-0 min-vh-100">

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

              <div className="auth-header text-center mb-4">
                <h2 className="h2">Welcome back!</h2>
                <p className="body-sm neutral5">
                  Enter your credentials to access your account
                </p>
              </div>

              <Form onSubmit={handleSubmit}>

                <div className="input-group-custom mb-3">
                  <Form.Control
                    className="auth-input"
                    type="email"
                    name="email"
                    placeholder=" "
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                  />
                  <label>Email</label>
                  {formData.emailTouched &&
                    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) && (
                      <small className="auth-error">Invalid email format</small>
                    )}
                </div>

                <div className="input-group-custom mb-4 password-groupe">
                  <Form.Control
                    className="auth-input"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder=" "
                    minLength={8}
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                  />
                  <label>Password</label>
                  <span
                    className="password-eye"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                  {formData.passwordTouched &&
                    formData.password.length < 8 && (
                      <small className="auth-error">
                        Password must be at least 8 characters
                      </small>
                    )}
                </div>

                <button
                  type="submit"
                  className="btn-primary-custom auth-btn w-100"
                  disabled={loading}
                >
                  {loading ? "Signing in..." : "Sign In"}
                </button>

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

          <Col
            md={6}
            className="image-side d-none d-md-block p-0"
            style={{ backgroundImage: `url(${bg})` }}
          />

        </Row>
      </Container>
    </section>
  );
}

export default Login;