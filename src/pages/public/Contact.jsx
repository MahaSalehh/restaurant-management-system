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
  });

  const [loading, setLoading] = useState(false);

  const { showToast } = useToast();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


const handleSubmit = async (e) => {
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

    {/* HEADER */}
    <div className="contact-header text-container text-center">
      <h1 className="h1 mb-4">Contact Us</h1>
      <p className="body-lg neutral5">
        We consider all the drivers of change gives you the components you need to change to create a truly happens.
      </p>
    </div>

    {/* FORM CARD */}
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
                    placeholder="Enter your name"
                    required
                  />
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
                    placeholder="Enter email address"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="contact-field">
              <Form.Label>Subject</Form.Label>
              <Form.Control
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Write a subject"
                required
              />
            </Form.Group>

            <Form.Group className="contact-field">
              <Form.Label>Message</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Write your message"
                required
              />
            </Form.Group>

            <Button
              type="submit"
              className="contact-btn btn-primary-custom "
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
            </Button>

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

      <Col lg={4} md={6}  xs={6}>
        <h6>Our Location</h6>
        <p>123 Bridge Street</p>
        <p>Nowhere Land, LA 12345 </p>
        <p>United States</p>
      </Col>
    </Row>
      </Col>
    </Row>

    {/* INFO SECTION */}
    

  </Container>
</section>
  );
}

export default Contact;