import { useEffect, useState } from "react";
import { bookingAPI } from "../service/api";
import { Modal, Button, Badge } from "react-bootstrap";
import { useToast } from "../context/ToastContext";

function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [tab, setTab] = useState("current");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const { showToast } = useToast();

  // ================= FETCH BOOKINGS =================
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

  // ================= DATE HELPERS =================
  const now = new Date();

  const isFutureBooking = (b) => {
    const bookingDate = new Date(b.booking_date);
    return bookingDate.getTime() >= now.getTime();
  };

  const currentBookings = bookings.filter(isFutureBooking);

  const previousBookings = bookings.filter(
    (b) => !isFutureBooking(b)
  );

  const data = tab === "current" ? currentBookings : previousBookings;

  // ================= BADGE =================
  const getBadge = (status) => {
    return {
      pending: "warning",
      accepted: "success",
      rejected: "danger",
    }[status] || "secondary";
  };

  // ================= LOADING =================
  if (loading) {
    return <p className="text-center body-md py-5">Loading bookings...</p>;
  }

  return (
    <div>

      <h5 className="section-title">My Bookings</h5>

      {/* TABS */}
      <div className="filter-bar">

        <button
          className={tab === "current" ? "active" : ""}
          onClick={() => setTab("current")}
        >
          Current
        </button>

        <button
          className={tab === "previous" ? "active" : ""}
          onClick={() => setTab("previous")}
        >
          Previous
        </button>

      </div>

      {/* EMPTY STATE */}
      {data.length === 0 && (
        <p className="text-center body-md py-4">
          No bookings found
        </p>
      )}

      {/* LIST */}
      <div className="order-list">

        {data.map((b) => (
          <div
            key={b.id}
            className="order-card"
            onClick={() => {
              setSelectedBooking(b);
              setShowModal(true);
            }}
          >

            <div>
              <h6>Booking #{b.id}</h6>
              <p>{b.booking_date}</p>
            </div>

            <Badge bg={getBadge(b.status)}>
              {b.status}
            </Badge>

          </div>
        ))}

      </div>

      {/* MODAL */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
      >

        <Modal.Header closeButton>
          <Modal.Title>
            Booking Details
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>

          {!selectedBooking ? (
            <p>Loading...</p>
          ) : (
            <>
              <p>
                <strong>Date:</strong>{" "}
                {selectedBooking.booking_date}
              </p>

              <p>
                <strong>Time:</strong>{" "}
                {selectedBooking.booking_time}
              </p>

              <p>
                <strong>Guests:</strong>{" "}
                {selectedBooking.guests}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                <Badge bg={getBadge(selectedBooking.status)}>
                  {selectedBooking.status}
                </Badge>
              </p>
            </>
          )}

        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="light"
            onClick={() => setShowModal(false)}
          >
            Close
          </Button>
        </Modal.Footer>

      </Modal>

    </div>
  );
}

export default Bookings;