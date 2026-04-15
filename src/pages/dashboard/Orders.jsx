import { useEffect, useState } from "react";
import { adminAPI } from "../../service/api";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [activeStatus, setActiveStatus] = useState(null);
  const [loadingId, setLoadingId] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
const [showModal, setShowModal] = useState(false);

  const fetchOrders = async () => {
    try {
      const res = await adminAPI.getAllOrders();
      setOrders(res.data.data || res.data);
    } catch (err) {
      console.error(err);
    }
  };
  const handleStatusChange = async (orderId, newStatus) => {
  try {
    setLoadingId(orderId); // بدأنا loading للـ order دي

    await adminAPI.updateOrderStatus(orderId, { status: newStatus });

    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId
          ? { ...order, status: newStatus }
          : order
      )
    );
  } catch (err) {
    console.error(err);
  } finally {
    setLoadingId(null); // وقفنا loading
  }
};

const handleViewOrder = (order) => {
  setSelectedOrder(order);
  setShowModal(true);
};

const getStatusColor = (status) => {
  switch (status) {
    case "pending":
      return "#ffc107"; // yellow
    case "accepted":
      return "#17a2b8"; // blue
    case "in progress":
      return "#6f42c1"; // purple
    case "delivered":
      return "#28a745"; // green
    case "rejected":
      return "#dc3545"; // red
    default:
      return "#ddd";
  }
};
  // ================= FETCH =================
  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ================= FILTER =================
  const filteredOrders = activeStatus
    ? orders.filter((order) => order.status === activeStatus)
    : orders;

  const statuses = ["pending", "accepted", "in_progress", "delivered", "rejected"];

  return (
    <div style={{ padding: "20px" }}>
      <h1>Orders</h1>

      {/* FILTER */}
      {/* ================= Tabs ================= */}
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

  {/* Status Buttons */}
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
            <th>Total</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredOrders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.user?.name}</td>
              <td>${order.total_price}</td>
              <td>
  <td>
  <span
    style={{
      padding: "4px 8px",
      borderRadius: "6px",
      backgroundColor: getStatusColor(order.status),
      color: "white",
      fontSize: "12px",
    }}
  >
    {order.status}
  </span>
</td>
</td>
<td>
  <button
    onClick={() => handleViewOrder(order)}
    style={{
      padding: "6px 12px",
      border: "none",
      borderRadius: "6px",
      background: "black",
      color: "white",
      cursor: "pointer",
    }}
  >
    View
  </button>
</td>
            </tr>
          ))}
        </tbody>
      </table>
      {showModal && selectedOrder && (
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
      <h3>Order Details</h3>

      <p><strong>ID:</strong> {selectedOrder.id}</p>
      <p><strong>User:</strong> {selectedOrder.user?.name}</p>
      <p><strong>Total:</strong> ${selectedOrder.total_price}</p>
      <p><strong>Status:</strong> {selectedOrder.status}</p>
      <p><strong>Address:</strong> {selectedOrder.address}</p>
      <p><strong>Phone:</strong> {selectedOrder.phone}</p>
      <p><strong>Notes:</strong> {selectedOrder.notes || "-"}</p>
<p>
  <strong>Status:</strong>
</p>

<div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
  <span
    style={{
      padding: "4px 8px",
      borderRadius: "6px",
      backgroundColor: getStatusColor(selectedOrder.status),
      color: "white",
      fontSize: "12px",
    }}
  >
    {selectedOrder.status}
  </span>

  <select
    value={selectedOrder.status}
    onChange={(e) =>
      handleStatusChange(selectedOrder.id, e.target.value)
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

export default Orders;