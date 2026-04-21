import { useEffect, useState } from "react";
import { orderAPI } from "../../service/api";
import { Modal, Button, Badge } from "react-bootstrap";
import { useToast } from "../../context/ToastContext";
import Loader from "../../components/Loader";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [tab, setTab] = useState("current");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const { showToast } = useToast();

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

  const currentOrders = orders.filter((o) =>
    ["pending", "accepted", "in_progress"].includes(o.status)
  );

  const previousOrders = orders.filter((o) =>
    ["delivered", "rejected"].includes(o.status)
  );

  const data = tab === "current" ? currentOrders : previousOrders;

  const getBadge = (status) =>
    ({
      pending: "warning",
      accepted: "info",
      in_progress: "primary",
      delivered: "success",
      rejected: "danger",
    }[status] || "secondary");

  if (loading) return <Loader />;

  return (
    <div className="list-page">

      <h5 className="section-title">My Orders</h5>

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
        <div className="empty-state">No orders found</div>
      )}

      <div className="card-list">
        {data.map((order) => (
          <div
            key={order.id}
            className="list-card"
            onClick={() => {
              setSelectedOrder(order);
              setShowModal(true);
            }}
          >
            <div>
              <h6>Order #{order.id}</h6>
              <p>{order.total_price} EGP</p>
            </div>

            <span className={`status ${order.status}`}>
              {order.status}
            </span>
          </div>
        ))}
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Order #{selectedOrder?.id}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {!selectedOrder ? (
            <div>Loading...</div>
          ) : (
            <>
              <p>
                <b>Status:</b>{" "}
                <span className={`status ${selectedOrder.status}`}>
                  {selectedOrder.status}
                </span>
              </p>

              <hr />

              <h6>Items</h6>

              {selectedOrder.order_items?.map((item) => {
                const price = item.menu_item?.price || 0;
                const qty = item.quantity;

                return (
                  <div key={item.id} className="item-row">
                    <div>
                      <strong>{item.menu_item?.name}</strong>
                      <p className="meta">
                        {price} EGP × {qty}
                      </p>
                    </div>

                    <span className="price">
                      {price * qty} EGP
                    </span>
                  </div>
                );
              })}

              <hr />

              <div className="total-row">
                <span>Total</span>
                <b>{selectedOrder.total_price} EGP</b>
              </div>
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

export default Orders;