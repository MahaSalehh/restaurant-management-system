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
  pending: "secondary", in_progress: "warning", accepted: "primary",
  delivered: "success", rejected: "danger",
};

const ORDER_STATUSES = ["pending", "in_progress", "accepted", "delivered", "rejected"];

function Orders() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const { showToast } = useToast();

  const fetchOrders = useCallback(() => adminAPI.getAllOrders(), []);
  const { data, loading, error, execute: refetch } = useAsync(fetchOrders);
  useToastError(error);

  const orders = (data?.data ?? data ?? [])
    .slice()
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  const filtered = orders
    .filter(o =>
      String(o.id).includes(search) ||
      (o.user?.name || "").toLowerCase().includes(search.toLowerCase())
    )
    .filter(order => {
      if (statusFilter === "all") return true;
      return order.status === statusFilter;
    });

  async function handleDelete(id) {
    if (!window.confirm("Delete this order?")) return;
    try {
      await adminAPI.deleteOrder(id);
      showToast("success", "Order deleted");
      refetch();
    } catch (err) {
      showToast("error", err.response?.data?.message || "Failed to delete order");
    }
  }

  async function handleStatusUpdate() {
    try {
      await adminAPI.updateOrderStatus(selectedOrder.id, { status: newStatus });
      showToast("success", "Status updated");
      setShowStatusModal(false);
      refetch();
    } catch (err) {
      showToast("error", err.response?.data?.message || "Failed to update status");
    }
  }

  return (
    <Container fluid className="py-3">
      <h2 className="fw-bold mb-1">Orders</h2>
      <p className="text-muted mb-4">Track and manage customer orders</p>

      <Row className="mb-3">
        <Col md={4}>
          <InputGroup>
            <Form.Control placeholder="Search by order ID or customer..." value={search}
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

        {ORDER_STATUSES.map(status => (
          <Button
            key={status}
            size="sm"
            variant={statusFilter === status ? "primary" : "outline-secondary"}
            onClick={() => setStatusFilter(status)}
            className="text-capitalize"
          >
            {status.replace("_", " ")}
          </Button>
        ))}
      </div>
      {loading ? (
        <div className="text-center py-5"><Spinner animation="border" /></div>
      ) : (
        <Table responsive hover bordered className="align-middle">
          <thead className="table-dark">
            <tr><th>#</th><th>Customer</th><th>Total</th><th>Status</th><th>Phone</th><th>Date</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {filtered.map(order => (
              <tr key={order.id}>
                <td data-label="#">#{order.id}</td>
                <td data-label="Customer">{order.user?.name || "—"}</td>
                <td data-label="Total">${order.total_price || order.total || "—"}</td>
                <td data-label="Status">
                  <Badge bg={STATUS_COLORS[order.status] || "secondary"}>{order.status}</Badge>
                </td>
                <td data-label="Phone">{order.user?.phone || "—"}</td>
                <td data-label="Date">{new Date(order.created_at).toLocaleDateString()}</td>
                <td data-label="Actions">
                  <div className="d-flex gap-2">
                    <Button size="sm" variant="primary"
                      onClick={() => { setSelectedOrder(order); setShowDetailModal(true); }}><FaEye /></Button>
                    <Button size="sm" variant="outline-secondary"
                      onClick={() => { setSelectedOrder(order); setNewStatus(order.status); setShowStatusModal(true); }}>
                      <FaEdit /> Status
                    </Button>
                    <Button size="sm" variant="outline-danger"
                      onClick={() => handleDelete(order.id)}><FaTrash /></Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Order #{selectedOrder?.id} Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOrder && (
            <>
              <p><strong>Customer:</strong> {selectedOrder.user?.name} ({selectedOrder.user?.email})</p>
              <p>
                <strong>Status:</strong>{" "}
                <Badge bg={STATUS_COLORS[selectedOrder.status]}>{selectedOrder.status}</Badge>
              </p>
              <p><strong>Total:</strong> ${selectedOrder.total_price}</p>
              <p><strong>Address:</strong> {selectedOrder.address}</p>
              <p><strong>Date:</strong> {new Date(selectedOrder.created_at).toLocaleString()}</p>
              <p><strong>Notes:</strong> {selectedOrder.notes || "—"}</p>

              <hr />
              <h6>Items</h6>
              <Table size="sm" bordered>
                <thead><tr><th>Item</th><th>Qty</th><th>Price</th></tr></thead>
                <tbody>
                  {(selectedOrder.items || selectedOrder.order_items || []).map((item, i) => (
                    <tr key={i}>
                      <td>{item.menu_item?.name || item.name}</td>
                      <td>{item.quantity}</td>
                      <td>${item.price}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </>
          )}
        </Modal.Body>
      </Modal>

      <Modal show={showStatusModal} onHide={() => setShowStatusModal(false)}>
        <Modal.Header closeButton><Modal.Title>Update Order Status</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form.Select value={newStatus} onChange={e => setNewStatus(e.target.value)}>
            {ORDER_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
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

export default Orders;