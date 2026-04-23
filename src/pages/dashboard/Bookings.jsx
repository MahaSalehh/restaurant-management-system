import { useState, useCallback } from "react";
import {
  Container, Row, Col, Table, Badge, Button,
  InputGroup, Form, Spinner, Modal,
} from "react-bootstrap";
import { FaSearch, FaEye, FaEdit, FaTrash } from "react-icons/fa";
import { adminAPI } from "../../service/api";
import { useAsync } from "../../hooks/useAsync";
import { useToastError } from "../../hooks/useToastsError";
import { useToast } from "../../context/ToastContext";

const STATUS_COLORS = {
  pending: "warning", accepted: "success", rejected: "danger",
};

const BOOKING_STATUSES = ["pending", "accepted", "rejected"];

function Bookings() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const { showToast } = useToast();

  const fetchBookings = useCallback(() => adminAPI.getAllBookings(), []);
  const { data, loading, error, execute: refetch } = useAsync(fetchBookings);
  useToastError(error);

  const bookings = (data?.data ?? data ?? [])
  .slice()
  .sort((a, b) => new Date(b.created_at || b.date) - new Date(a.created_at || a.date));
  
  const filtered = bookings
  .filter(b =>
    String(b.id).includes(search) ||
    (b.user?.name || b.name || "").toLowerCase().includes(search.toLowerCase())
  )
  .filter(b => {
    if (statusFilter === "all") return true;
    return b.status === statusFilter;
  });

  async function handleDelete(id) {
    if (!window.confirm("Delete this booking?")) return;
    try {
      await adminAPI.deleteBooking(id);
      showToast("success", "Booking deleted");
      refetch();
    } catch (err) {
      showToast("error", err.response?.data?.message || "Failed to delete booking");
    }
  }

  async function handleStatusUpdate() {
    try {
      await adminAPI.updateBookingStatus(selectedBooking.id, { status: newStatus });
      showToast("success", "Status updated");
      setShowStatusModal(false);
      refetch();
    } catch (err) {
      showToast("error", err.response?.data?.message || "Failed to update status");
    }
  }

  return (
    <Container fluid className="py-3">
      <h2 className="fw-bold mb-1" style={{ color: "var(--primary-color)" }}>Bookings</h2>
      <p className="text-muted mb-4">Manage table reservations and bookings</p>

      <Row className="mb-3">
        <Col md={4}>
          <InputGroup>
            <Form.Control placeholder="Search bookings..." value={search}
              onChange={e => setSearch(e.target.value)} />
            <InputGroup.Text><FaSearch /></InputGroup.Text>
          </InputGroup>
        </Col>
      </Row>

<div className="d-flex flex-wrap gap-2 mb-3">
  <Button
    size="sm"
    variant={statusFilter === "all" ? "primary" : "outline-secondary"}
    onClick={() => setStatusFilter("all")}
  >
    All
  </Button>

  {BOOKING_STATUSES.map(status => (
    <Button
      key={status}
      size="sm"
      variant={statusFilter === status ? "primary" : "outline-secondary"}
      onClick={() => setStatusFilter(status)}
      className="text-capitalize"
    >
      {status}
    </Button>
  ))}
</div>

      {loading ? (
        <div className="text-center py-5"><Spinner animation="border" /></div>
      ) : (
        <Table responsive hover bordered className="align-middle">
          <thead className="table-dark">
            <tr>
              <th>#</th><th>Customer</th><th>Date</th><th>Time</th>
              <th>Guests</th><th>Status</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(booking => (
              <tr key={booking.id}>
                <td data-label="#">#{booking.id}</td>
                <td data-label="Customer">{booking.user?.name || booking.name || "—"}</td>
                <td data-label="Date">{booking.date || booking.booking_date || "—"}</td>
                <td data-label="Time">{booking.time || booking.booking_time || "—"}</td>
                <td data-label="Guests">{booking.guests || booking.number_of_guests || "—"}</td>
                <td data-label="Status">
                  <Badge bg={STATUS_COLORS[booking.status] || "secondary"}>{booking.status}</Badge>
                </td>
                <td data-label="Actions">
                  <div className="d-flex gap-2">
                    <Button size="sm" variant="primary"
                      onClick={() => { setSelectedBooking(booking); setShowDetailModal(true); }}><FaEye /></Button>
                    <Button size="sm" variant="outline-secondary"
                      onClick={() => { setSelectedBooking(booking); setNewStatus(booking.status); setShowStatusModal(true); }}>
                      <FaEdit /> Status
                    </Button>
                    <Button size="sm" variant="outline-danger"
                      onClick={() => handleDelete(booking.id)}><FaTrash /></Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Detail Modal */}
      <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Booking #{selectedBooking?.id}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedBooking && (
            <>
              <p><strong>Customer:</strong> {selectedBooking.user?.name || selectedBooking.name}</p>
              <p><strong>Email:</strong> {selectedBooking.user?.email || selectedBooking.email}</p>
              <p><strong>Phone:</strong> {selectedBooking.phone || "—"}</p>
              <p><strong>Date:</strong> {selectedBooking.date || selectedBooking.booking_date}</p>
              <p><strong>Time:</strong> {selectedBooking.time || selectedBooking.booking_time}</p>
              <p><strong>Guests:</strong> {selectedBooking.guests || selectedBooking.number_of_guests}</p>
              <p>
                <strong>Status:</strong>{" "}
                <Badge bg={STATUS_COLORS[selectedBooking.status]}>{selectedBooking.status}</Badge>
              </p>
            </>
          )}
        </Modal.Body>
      </Modal>

      {/* Status Modal */}
      <Modal show={showStatusModal} onHide={() => setShowStatusModal(false)}>
        <Modal.Header closeButton><Modal.Title>Update Booking Status</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form.Select value={newStatus} onChange={e => setNewStatus(e.target.value)}>
            {BOOKING_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </Form.Select>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowStatusModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleStatusUpdate}>Update</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default Bookings;