import React, { useState } from "react";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/light.css";
import { bookingAPI } from "../../service/api";
import { useToast } from "../../context/ToastContext";

const Booking = () => {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    date: null,
    time: null,
    guests: 1,
  });

  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

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

      showToast("success", "Table booked successfully 🎉");

      setForm({
        name: "",
        phone: "",
        date: null,
        time: null,
        guests: 1,
      });

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
    <section className="booking-page">


      <div className="booking-hero">
        <h1 className="h1">Book A Table</h1>
        <p className="body-md">
          We consider all the drivers of change gives you the components you need to change to create a truly happens.
        </p>
      </div>

      <div className="booking-card-wrapper">

        <form className="booking-card" onSubmit={handleSubmit}>

          <div className="field-row">

            <div className="contact-field date-picker">
              <label>Date</label>
              <Flatpickr
                options={{
                  dateFormat: "Y-m-d",
                  minDate: "today",
                }}
                type="date"
                value={form.date}
                onChange={handleDateChange}
                placeholder="Select date"
              />
            </div>

            <div className="contact-field time-picker">
              <label>Time</label>
              <Flatpickr
                options={{
                  enableTime: true,
                  noCalendar: true,
                  dateFormat: "H:i",
                  time_24hr: true,
                }}
                type="time"
                value={form.time}
                onChange={handleTimeChange}
                placeholder="Select time"
              />
            </div>

          </div>
<div className="field-row">

          <div className="contact-field">
            <label>Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter your name"
            />
          </div>

          <div className="contact-field">
            <label>Phone</label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="x-xxx-xxx-xxxx"
            />
          </div>
</div>
          <div className="contact-field">
            <label>Guests</label>
            <select
              name="guests"
              value={form.guests}
              onChange={handleChange}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                <option key={n} value={n}>
                  {n} Person
                </option>
              ))}
            </select>
          </div>

          <button className="booking-btn" disabled={loading}>
            {loading ? "Booking..." : "Book A Table"}
          </button>

        </form>

      </div>

      <div className="booking-map"></div>

    </section>
  );
};

export default Booking;