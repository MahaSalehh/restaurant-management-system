import { useEffect, useState } from "react";
import { adminAPI } from "../../service/api";

import PageLayout from "./components/PageLayout";
import DataTable from "./components/DataTable";
import ActionButtons from "./components/ActionButtons";
import Modal from "./components/Modal";
import StatusBadge from "./components/StatusBadge";

function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [activeStatus, setActiveStatus] = useState(null);
  const [loadingId, setLoadingId] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const statuses = ["pending", "accepted", "rejected"];

  // FETCH
  const fetchBookings = async () => {
    try {
      const res = await adminAPI.getAllBookings();
      setBookings(res.data.data || res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // STATUS UPDATE
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

      if (selectedBooking?.id === bookingId) {
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

  const filteredBookings = activeStatus
    ? bookings.filter((b) => b.status === activeStatus)
    : bookings;

  return (
    <PageLayout title="Bookings">

      {/* FILTER */}
      <div className=" dash-filters">
        <button
          className={`btn ${activeStatus === null ? "btn-dark" : "btn-light"}`}
          onClick={() => setActiveStatus(null)}
        >
          All
        </button>

        {statuses.map((s) => (
          <button
            key={s}
            className={`btn ${activeStatus === s ? "btn-dark" : "btn-light"}`}
            onClick={() => setActiveStatus(s)}
          >
            {s}
          </button>
        ))}
      </div>

      {/* TABLE */}
      <DataTable columns={["ID", "User", "Date", "Guests", "Status", "Actions"]}>
        {(filteredBookings || []).map((b) => (
          <tr key={b.id}>
            <td>{b.id}</td>
            <td>{b.user?.name}</td>
            <td>{b.booking_date}</td>
            <td>{b.guests}</td>

            <td>
              <StatusBadge status={b.status} />
            </td>

            <td>
              <ActionButtons
  actions={[
    {
      label: "View",
      variant: "primary",
      onClick: () => {
        setSelectedBooking(b);
        setShowModal(true);
      },
    },
    
  ]}
/>
            </td>
          </tr>
        ))}
      </DataTable>

      {/* MODAL */}
      <Modal
        open={showModal}
        title="Booking Details"
        onClose={() => setShowModal(false)}
      >
        {selectedBooking && (
          <div>
            <p><strong>ID:</strong> {selectedBooking.id}</p>
            <p><strong>User:</strong> {selectedBooking.user?.name}</p>
            <p><strong>Phone:</strong> {selectedBooking.user?.phone}</p>
            <p><strong>Date:</strong> {selectedBooking.booking_date}</p>
            <p><strong>Time:</strong> {selectedBooking.booking_time}</p>
            <p><strong>Guests:</strong> {selectedBooking.guests}</p>

            <StatusBadge status={selectedBooking.status} />

            <div className="mt-3">
              <select
                value={selectedBooking.status}
                disabled={loadingId === selectedBooking.id}
                onChange={(e) =>
                  handleStatusChange(selectedBooking.id, e.target.value)
                }
              >
                {statuses.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </Modal>

    </PageLayout>
  );
}

export default Bookings;