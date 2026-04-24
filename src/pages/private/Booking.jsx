import React, { useState } from "react";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/light.css";
import { bookingAPI } from "../../service/api";
import { useToast } from "../../context/ToastContext";
import { Card, Col, Container, Form, Row, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Booking = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    date: "",
    time: "",
    guests: 1,
    nameTouched: false,
    phoneTouched: false,
  });

  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const handleBlur = (e) => {
    const { name } = e.target;

    setForm((prev) => ({
      ...prev,
      [`${name}Touched`]: true,
    }));
  };
  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    setForm((prev) => ({
      ...prev,
      phone: value,
    }));
  }

  const handleDateChange = ([date]) => {
    setForm((prev) => ({ ...prev, date }));
  };

  const handleTimeChange = ([time]) => {
    setForm((prev) => ({ ...prev, time }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.phone || !form.date || !form.time) {
      showToast("error", "Please fill all required fields");
      return;
    }

    setLoading(true);

    try {
      const booking_date = new Date(form.date).toLocaleDateString("en-CA");

      const booking_time = new Date(form.time).toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
      });

      await bookingAPI.create({
        name: form.name,
        phone: form.phone,
        booking_date,
        booking_time,
        guests: form.guests,
      });

      showToast("success", "Table booked successfully");

      setForm({
        name: "",
        phone: "",
        date: "",
        time: "",
        guests: 1,
      });
      navigate("/");

    } catch (err) {
      const msg =
        err.response?.data?.message ||
        "Failed to book table. Please try again.";

      showToast("error", msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="contact-section">

      <div className="booking-hero text-center">
        <h1 className="h1 mb-4">Book A Table</h1>
        <p className="body-md">
          We consider all the drivers of change gives you the components you need to change to create a truly happens.
        </p>
      </div>
      <div className="booking-card-wrapper">
        <Container>
          <Row className="justify-content-center">
            <Col lg={8} md={10}>
              <Card className="booking-card">

                <Form onSubmit={handleSubmit}>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="contact-field date-picker">
                        <Form.Label>Date</Form.Label>
                        <Flatpickr
                          className="form-control"
                          options={{
                            dateFormat: "Y-m-d",
                            minDate: "today",
                          }}
                          value={form.date}
                          onChange={handleDateChange}
                          placeholder="Select date"
                        />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group className="contact-field time-picker">
                        <Form.Label>Time</Form.Label>
                        <Flatpickr
                          className="form-control"
                          options={{
                            enableTime: true,
                            noCalendar: true,
                            dateFormat: "H:i",
                            time_24hr: true,
                          }}
                          value={form.time}
                          onChange={handleTimeChange}
                          placeholder="Select time"
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="contact-field">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                          name="name"
                          value={form.name}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="Enter your name"
                          minLength={3}
                          pattern="^[A-Za-z\s]{3,}$"
                          required
                          isInvalid={form.nameTouched && !/^[A-Za-z\s]{3,}$/.test(form.name)}
                        />
                        <Form.Control.Feedback type="invalid">
                          Name must be at least 3 characters and contain only letters and spaces
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group className="contact-field">
                        <Form.Label>Phone</Form.Label>
                        <Form.Control
                          name="phone"
                          value={form.phone}
                          onChange={handlePhoneChange}
                          onBlur={handleBlur}
                          placeholder="x-xxx-xxx-xxxx"
                          pattern="^01[0-9]{9}$"
                          maxLength={11}
                          required
                          isInvalid={form.phoneTouched && !/^01[0-9]{9}$/.test(form.phone)}
                        />
                        <Form.Control.Feedback type="invalid">
                          Phone number must start with 01 and be 11 digits
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="contact-field">
                    <Form.Label>Guests</Form.Label>
                    <Form.Select
                      name="guests"
                      value={form.guests}
                      onChange={handleChange}
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                        <option key={n} value={n}>
                          {n} Person
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>

                  <button
                    type="submit"
                    className="contact-btn btn-primary-custom"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Spinner size="sm" className="me-2" />
                        Booking...
                      </>
                    ) : (
                      "Book A Table"
                    )}
                  </button>

                </Form>

              </Card>
            </Col>
          </Row>
        </Container>
      </div>
      <div className="booking-map"></div>

    </section>
  );
};

export default Booking;