import { useState } from "react";
import { adminAPI } from "../../service/api";

import PageLayout from "./components/PageLayout";
import CrudModal from "./components/Modal";
import { useCrudPage } from "./hooks/useCrudPage";

import StatusBadge from "./components/StatusBadge";

function Bookings() {

  const statuses = ["pending", "accepted", "rejected"];

  // ================= CRUD HOOK =================
  const {
    data: bookings = [],
    loading,
    formData,
    setFormData,
    showModal,
    setShowModal,
    openEdit,
  } = useCrudPage({
    getAll: adminAPI.getAllBookings,
    create: async () => {},
    update: adminAPI.updateBookingStatus,
    delete: async () => {},
  });

  // ================= STATUS FILTER =================
  const [activeStatus, setActiveStatus] = useState(null);

  const filteredBookings = activeStatus
    ? bookings.filter((b) => b.status === activeStatus)
    : bookings;

  // ================= STATUS UPDATE =================
  const handleStatusChange = async (bookingId, newStatus) => {
    await adminAPI.updateBookingStatus(bookingId, {
      status: newStatus,
    });

    setFormData((prev) =>
      Array.isArray(prev)
        ? prev.map((b) =>
            b.id === bookingId ? { ...b, status: newStatus } : b
          )
        : prev
    );
  };

  // ================= OPEN MODAL =================
  const handleView = (booking) => {
    setFormData(booking);
    setShowModal(true);
  };

  return (
    <PageLayout title="Bookings">

      {/* FILTER */}
      <div className="dash-filters mb-3">
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

      {/* TABLE (still needed here because it's data-heavy) */}
      <div className="card p-3">

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
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => handleView(b)}
                  >
                    View
                  </button>
                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

      {/* MODAL */}
      <CrudModal
        show={showModal}
        onHide={() => setShowModal(false)}
        title="Booking Details"
        formData={formData}
        setFormData={setFormData}
        fields={[]}
        onSubmit={(e) => e.preventDefault()}
      >
        {formData && (
          <div>

            <p><strong>ID:</strong> {formData.id}</p>
            <p><strong>User:</strong> {formData.user?.name}</p>
            <p><strong>Phone:</strong> {formData.user?.phone}</p>
            <p><strong>Date:</strong> {formData.booking_date}</p>
            <p><strong>Time:</strong> {formData.booking_time}</p>
            <p><strong>Guests:</strong> {formData.guests}</p>

            <StatusBadge status={formData.status} />

            <div className="mt-3">

              <select
                value={formData.status}
                onChange={(e) =>
                  handleStatusChange(formData.id, e.target.value)
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
      </CrudModal>

    </PageLayout>
  );
}

export default Bookings;