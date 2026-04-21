import { useEffect, useState } from "react";
import { bookingAPI } from "../../service/api";
import { Modal, Button, Badge } from "react-bootstrap";
import { useToast } from "../../context/ToastContext";
import Loader from "../../components/Loader";

function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [tab, setTab] = useState("current");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const { showToast } = useToast();

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await bookingAPI.myBookings();

      const data = res.data?.data || res.data || [];
      setBookings(Array.isArray(data) ? data : []);
    } catch {
      showToast("error", "Failed to load bookings");
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const now = new Date();

  const currentBookings = bookings.filter(
    (b) => new Date(b.booking_date) >= now
  );

  const previousBookings = bookings.filter(
    (b) => new Date(b.booking_date) < now
  );

  const data = tab === "current" ? currentBookings : previousBookings;

  const getBadge = (status) =>
    ({
      pending: "warning",
      accepted: "success",
      rejected: "danger",
    }[status] || "secondary");

  if (loading) return <Loader />;

  return (
    <div className="list-page">

      <h5 className="section-title">My Bookings</h5>

      <div className="filter-bar">
        <button
          className={tab === "current" ? "active" : ""}
          onClick={() => setTab("current")}
        >
          <span>Current</span>
        </button>

        <button
          className={tab === "previous" ? "active" : ""}
          onClick={() => setTab("previous")}
        >
          <span>Previous</span>
        </button>
      </div>

      {data.length === 0 && (
        <div className="empty-state">No bookings found</div>
      )}

      <div className="card-list">
        {data.map((b) => (
          <div
            key={b.id}
            className="list-card"
            onClick={() => {
              setSelectedBooking(b);
              setShowModal(true);
            }}
          >
            <div>
              <h6>Booking #{b.id}</h6>
              <p>{b.booking_date}</p>
            </div>

            <span className={`status ${b.status}`}>
              {b.status}
            </span>
          </div>
        ))}
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Booking #{selectedBooking?.id}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {!selectedBooking ? (
            <div>Loading...</div>
          ) : (
            <>
              <p>
                <b>Status:</b>{" "}
                <span className={`status ${selectedBooking.status}`}>
                  {selectedBooking.status}
                </span>
              </p>
              <p><b>Date:</b> {selectedBooking.booking_date}</p>
              <p><b>Time:</b> {selectedBooking.booking_time}</p>
              <p><b>Guests:</b> {selectedBooking.guests}</p>

              
            </>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="light" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

    </div>
  );
}

export default Bookings;