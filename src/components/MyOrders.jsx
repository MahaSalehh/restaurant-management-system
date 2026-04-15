import { useEffect, useState } from "react";
import { orderAPI } from "../service/api";
import { Modal, Button, Badge } from "react-bootstrap";
import { useToast } from "../context/ToastContext";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [tab, setTab] = useState("current");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const { showToast } = useToast();

  // ================= FETCH ORDERS =================
  const fetchOrders = async () => {
    try {
      setLoading(true);

      const res = await orderAPI.myOrders();

      const data =
        res?.data?.data?.data ||
        res?.data?.data ||
        res?.data ||
        [];

      setOrders(Array.isArray(data) ? data : []);

    } catch {
      showToast("error", "Failed to load orders");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // ================= FILTER =================
  const currentOrders = orders.filter((o) =>
    ["pending", "accepted", "in_progress"].includes(o.status)
  );

  const previousOrders = orders.filter((o) =>
    ["delivered", "rejected"].includes(o.status)
  );

  const data = tab === "current" ? currentOrders : previousOrders;

  // ================= BADGE =================
  const getBadge = (status) => {
    return {
      pending: "warning",
      accepted: "info",
      in_progress: "primary",
      delivered: "success",
      rejected: "danger",
    }[status] || "secondary";
  };

  // ================= LOADING =================
  if (loading) {
    return <p className="text-center body-md py-5">Loading orders...</p>;
  }

  return (
    <div>

      <h5 className="section-title">My Orders</h5>

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
          No orders found
        </p>
      )}

      {/* LIST */}
      <div className="order-list">

        {data.map((order) => (
          <div
            key={order.id}
            className="order-card"
            onClick={() => {
              setSelectedOrder(order);
              setShowModal(true);
            }}
          >

            <div>
              <h6>Order #{order.id}</h6>
              <p>{order.total_price} EGP</p>
            </div>

            <Badge bg={getBadge(order.status)}>
              {order.status}
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
            Order #{selectedOrder?.id || "..." }
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>

          {!selectedOrder ? (
            <p>Loading...</p>
          ) : (
            <>
              <p>
                <strong>Status:</strong>{" "}
                <Badge bg={getBadge(selectedOrder.status)}>
                  {selectedOrder.status}
                </Badge>
              </p>

              <hr />

              <h6>Items</h6>

              {selectedOrder.order_items?.map((item) => {
                const price = item.menu_item?.price || 0;
                const qty = item.quantity;
                const subtotal = price * qty;

                return (
                  <div key={item.id} className="item-row">

                    <div>
                      <strong>{item.menu_item?.name}</strong>

                      <p className="item-meta">
                        {price} EGP × {qty}
                      </p>

                    </div>

                    <span className="item-price">
                      {subtotal} EGP
                    </span>

                  </div>
                );
              })}

              <hr />

              <div className="total-row">
                <span>Total</span>
                <strong>
                  {selectedOrder.total_price} EGP
                </strong>
              </div>

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

export default Orders;