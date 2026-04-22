import { useState } from "react";
import { adminAPI } from "../../service/api";

import PageLayout from "./components/PageLayout";
import { useCrudPage } from "./hooks/useCrudPage";
import StatusBadge from "./components/StatusBadge";
import Modal from "./components/Modal";

function Orders() {

  const statuses = [
    "pending",
    "accepted",
    "in_progress",
    "delivered",
    "rejected",
  ];

  // ================= CRUD HOOK =================
  const {
    data: orders = [],
    loading,
    formData,
    setFormData,
  } = useCrudPage({
    getAll: adminAPI.getAllOrders,
    create: async () => {},
    update: adminAPI.updateOrderStatus,
    delete: async () => {},
  });

  // ================= LOCAL STATE =================
  const [activeStatus, setActiveStatus] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loadingId, setLoadingId] = useState(null);

  // ================= FILTER =================
  const filteredOrders = activeStatus
    ? orders.filter((o) => o.status === activeStatus)
    : orders;

  // ================= STATUS UPDATE =================
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setLoadingId(orderId);

      await adminAPI.updateOrderStatus(orderId, {
        status: newStatus,
      });

      setFormData((prev) =>
        prev.map((o) =>
          o.id === orderId ? { ...o, status: newStatus } : o
        )
      );

      if (selectedOrder?.id === orderId) {
        setSelectedOrder((prev) => ({
          ...prev,
          status: newStatus,
        }));
      }
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <PageLayout title="Orders">

      {/* FILTER */}
      <div className="mb-3 d-flex gap-2 flex-wrap">

        <button
          className={`btn ${!activeStatus ? "btn-dark" : "btn-light"}`}
          onClick={() => setActiveStatus(null)}
        >
          All
        </button>

        {statuses.map((status) => (
          <button
            key={status}
            className={`btn ${activeStatus === status ? "btn-dark" : "btn-light"}`}
            onClick={() => setActiveStatus(status)}
          >
            {status}
          </button>
        ))}

      </div>

      {/* TABLE */}
      <div className="card p-3">

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

            {(filteredOrders || []).map((order) => (
              <tr key={order.id}>

                <td>{order.id}</td>
                <td>{order.user?.name}</td>
                <td>${order.total_price}</td>

                <td>
                  <StatusBadge status={order.status} />
                </td>

                <td>
                  <button
                    className="btn btn-dark btn-sm"
                    onClick={() => setSelectedOrder(order)}
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
      <Modal
        open={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
      >

        {selectedOrder && (
          <div>

            <h4>Order Details</h4>

            <p><b>ID:</b> {selectedOrder.id}</p>
            <p><b>User:</b> {selectedOrder.user?.name}</p>
            <p><b>Total:</b> ${selectedOrder.total_price}</p>
            <p><b>Address:</b> {selectedOrder.address}</p>
            <p><b>Phone:</b> {selectedOrder.phone}</p>

            {/* STATUS CONTROL */}
            <div className="d-flex align-items-center gap-2 mt-2">

              <StatusBadge status={selectedOrder.status} />

              <select
                className="form-select"
                value={selectedOrder.status}
                onChange={(e) =>
                  handleStatusChange(selectedOrder.id, e.target.value)
                }
                disabled={loadingId === selectedOrder.id}
              >
                {statuses.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>

            </div>

            <button
              className="btn btn-danger mt-3"
              onClick={() => setSelectedOrder(null)}
            >
              Close
            </button>

          </div>
        )}

      </Modal>

    </PageLayout>
  );
}

export default Orders;