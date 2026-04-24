import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
} from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import bg from "../../assets/auth.png";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",

    nameTouched: false,
    emailTouched: false,
    phoneTouched: false,
    passwordTouched: false,
    confirmPasswordTouched: false,
  });

  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const isMatch =
    formData.password === formData.confirmPassword;

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
  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    setFormData((prev) => ({
      ...prev,
      phone: value,
    }));
  }

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

            <div
              className="form-wrapper w-100"
              style={{ maxWidth: "420px" }}
            >

              <h2 className="mb-4 text-center">
                Get Started Now
              </h2>

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
                    onBlur={handleBlur}
                    pattern="^[A-Za-z\u0600-\u06FF\s]{3,}$"
                    required
                  />
                  <label>Name</label>
                  {formData.nameTouched &&
                    !/^[A-Za-z\u0600-\u06FF\s]{3,}$/.test(formData.name) && (
                      <small className="auth-error">
                        Name must be at least 3 letters and no special characters
                      </small>
                    )}
                </div>

                <div className="input-group-custom mb-2">
                  <Form.Control
                    type="email"
                    name="email"
                    className="auth-input"
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

                <div className="input-group-custom mb-2">
                  <Form.Control
                    type="text"
                    name="phone"
                    className="auth-input"
                    placeholder=" "
                    maxLength={11}
                    pattern="^01[0-9]{9}"
                    value={formData.phone}
                    onChange={handlePhoneChange}
                    onBlur={handleBlur}
                    required
                  />
                  <label>Phone</label>
                  {formData.phoneTouched &&
                    !/^01[0-9]{9}$/.test(formData.phone) && (
                      <small className="auth-error">
                        Phone must start with 01 and be 11 digits
                      </small>
                    )}
                </div>

                <div className="input-group-custom mb-2 password-group">
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    name="password"
                    className="auth-input"
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

                <div className="input-group-custom mb-3 password-group">
                  <Form.Control
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    className={`auth-input ${formData.confirmPassword
                      ? isMatch
                        ? "match"
                        : "no-match"
                      : ""
                      }`}
                    placeholder=" "
                    minLength={8}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                  />
                  <label>Confirm Password</label>
                  <span
                    className="password-eye"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                  {formData.confirmPasswordTouched && !isMatch && (
                    <small className="auth-error">
                      Passwords do not match
                    </small>
                  )}
                </div>

                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    label="I agree to the terms & policies"
                    required
                  />
                </Form.Group>

                <button
                  type="submit"
                  className="btn-primary-custom w-100 auth-btn"
                  disabled={loading}
                >
                  {loading
                    ? "Creating Account..."
                    : "Sign Up"}
                </button>

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