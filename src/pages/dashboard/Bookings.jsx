import { useEffect, useState } from "react";
import { adminAPI } from "../../service/api";

function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [activeStatus, setActiveStatus] = useState(null);
  const [loadingId, setLoadingId] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const statuses = ["pending", "accepted", "rejected"];

  // ================= FETCH =================
  const fetchBookings = async () => {
    try {
      const res = await adminAPI.getAllBookings();
      setBookings(res.data.data || res.data.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // ================= UPDATE STATUS =================
  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      setLoadingId(bookingId);

      await adminAPI.updateBookingStatus(bookingId, {
        status: newStatus,
      });

      setBookings((prev) =>
        prev.map((b) =>
          b.id === bookingId ? { ...b, status: newStatus } : b
        )
      );

      // update modal if open
      if (selectedBooking && selectedBooking.id === bookingId) {
        setSelectedBooking((prev) => ({
          ...prev,
          status: newStatus,
        }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingId(null);
    }
  };

  // ================= VIEW =================
  const handleViewBooking = (booking) => {
    setSelectedBooking(booking);
    setShowModal(true);
  };

  // ================= FILTER =================
  const filteredBookings = activeStatus
    ? bookings.filter((b) => b.status === activeStatus)
    : bookings;

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "#ffc107";
      case "accepted":
        return "#28a745";
      case "rejected":
        return "#dc3545";
      default:
        return "#ddd";
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Bookings</h1>

      
<div
  style={{
    marginBottom: "20px",
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  }}
>
  {/* All */}
  <button
    onClick={() => setActiveStatus(null)}
    style={{
      padding: "8px 16px",
      background: activeStatus === null ? "black" : "#ddd",
      color: activeStatus === null ? "white" : "black",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
    }}
  >
    All
  </button>

  {/* Status Tabs */}
  {statuses.map((status) => (
    <button
      key={status}
      onClick={() => setActiveStatus(status)}
      style={{
        padding: "8px 16px",
        background: activeStatus === status ? "black" : "#ddd",
        color: activeStatus === status ? "white" : "black",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        textTransform: "capitalize",
      }}
    >
      {status}
    </button>
  ))}
</div>
      {/* TABLE */}
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>User</th>
            <th>Date</th>
            <th>Guests</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredBookings.map((booking) => (
            <tr key={booking.id}>
              <td>{booking.id}</td>
              <td>{booking.user?.name}</td>
              <td>{booking.booking_date}</td>
              <td>{booking.guests}</td>

              <td>
                <span
                  style={{
                    padding: "4px 8px",
                    borderRadius: "6px",
                    backgroundColor: getStatusColor(booking.status),
                    color: "white",
                  }}
                >
                  {booking.status}
                </span>
              </td>

              <td>
                <button onClick={() => handleViewBooking(booking)}
                    style={{
      padding: "6px 12px",
      border: "none",
      borderRadius: "6px",
      background: "black",
      color: "white",
      cursor: "pointer",}}>
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* MODAL */}
      {showModal && selectedBooking && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "10px",
              width: "400px",
            }}
          >
            <h3>Booking Details</h3>

            <p><strong>ID:</strong> {selectedBooking.id}</p>
            <p><strong>User:</strong> {selectedBooking.user?.name}</p>
            <p><strong>Phone:</strong> {selectedBooking.user?.phone}</p>
            <p><strong>Date:</strong> {selectedBooking.booking_date}</p>
            <p><strong>Time:</strong> {selectedBooking.booking_time}</p>
            <p><strong>Guests:</strong> {selectedBooking.guests}</p>

            {/* STATUS UPDATE */}
            <p><strong>Status:</strong></p>

            <div style={{ display: "flex", gap: "10px" }}>
              <span
                style={{
                  padding: "4px 8px",
                  borderRadius: "6px",
                  backgroundColor: getStatusColor(selectedBooking.status),
                  color: "white",
                }}
              >
                {selectedBooking.status}
              </span>

              <select
                value={selectedBooking.status}
                disabled={loadingId === selectedBooking.id}
                onChange={(e) =>
                  handleStatusChange(selectedBooking.id, e.target.value)
                }
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => setShowModal(false)}
              style={{
          marginTop: "10px",
          padding: "8px 16px",
          border: "none",
          borderRadius: "6px",
          background: "red",
          color: "white",
          cursor: "pointer",
        }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Bookings;