import { useState } from "react";
import { Container, Row, Col, Form, Button, Card, Spinner } from "react-bootstrap";
import { contactAPI } from "../../service/api";
import { useToast } from "../../context/ToastContext";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    nameTouched: false,
    subjectTouched: false,
    messageTouched: false,
    emailTouched: false,
  });

  const [loading, setLoading] = useState(false);

  const { showToast } = useToast();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleBlur = (e) => {
    const { name } = e.target;

    setFormData((prev) => ({
      ...prev,
      [`${name}Touched`]: true,
    }));
  };

  const handleSubmit = async (e) => {
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      showToast("error", "Please fill all required fields");
      return;
    }
    e.preventDefault();

    setLoading(true);

    try {
      await contactAPI.send(formData);

      showToast("success", "Message sent successfully");

      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        "Failed to send message. Please try again.";

      showToast("error", msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="contact-section">
      <Container>

        <div className="contact-header text-center">
          <h1 className="h1 mb-4">Contact Us</h1>
          <p className="body-lg neutral5 mb-4">
            We consider all the drivers of change gives you the components you need to change to create a truly happens.
          </p>
        </div>

        <Row className="justify-content-center">
          <Col lg={8} md={10}>
            <Card className="contact-cards card-padding-lg">

              <Form onSubmit={handleSubmit}>

                <Row>
                  <Col md={6}>
                    <Form.Group className="contact-field">
                      <Form.Label>Name</Form.Label>
                      <Form.Control
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Enter your name"
                        required
                        minLength={3}
                        isInvalid={formData.nameTouched && !/^[A-Za-z\s]{3,}$/.test(formData.name)}
                      />
                      <Form.Control.Feedback type="invalid">
                        Name must be at least 3 characters and contain only letters and spaces
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="contact-field">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Enter email address"
                        required
                        isInvalid={formData.emailTouched && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)}
                      />
                      <Form.Control.Feedback type="invalid">
                        Please enter a valid email address
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="contact-field">
                  <Form.Label>Subject</Form.Label>
                  <Form.Control
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Write a subject"
                    required
                    isInvalid={formData.subjectTouched && formData.subject.trim().length === 0}
                  />
                  <Form.Control.Feedback type="invalid">
                    Subject cannot be empty
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="contact-field">
                  <Form.Label>Message</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={5}
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Write your message"
                    required
                    isInvalid={formData.messageTouched && formData.message.trim().length === 0}
                  />
                  <Form.Control.Feedback type="invalid">
                    Message cannot be empty
                  </Form.Control.Feedback>
                </Form.Group>

                <button
                  type="submit"
                  className="contact-btn btn-primary-custom"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Spinner size="sm" className="me-2" />
                      Sending...
                    </>
                  ) : (
                    "Send Message"
                  )}
                </button>

              </Form>
            </Card>

            <Row className="contact-info mt-5 text-center text-md-start justify-content-center">
              <Col lg={4} md={6} xs={6}>
                <h6>Call Us</h6>
                <h3 className="h3">+1-234-567-8900</h3>
              </Col>

              <Col lg={4} md={6} xs={6}>
                <h6>Hours</h6>
                <p>Mon-Fri: 11am - 8pm</p>
                <p>Sat, Sun: 9am - 10pm</p>
              </Col>

              <Col lg={4} md={6} xs={6}>
                <h6>Our Location</h6>
                <p>123 Bridge Street</p>
                <p>Nowhere Land, LA 12345</p>
                <p>United States</p>
              </Col>
            </Row>

          </Col>
        </Row>

      </Container>
    </section>
  );
}

export default Contact;