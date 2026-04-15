import { useEffect, useState } from "react";
import { settingsAPI } from "../../service/api";

function Notifications() {
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = async () => {
    try {
      const res = await settingsAPI.getNotifications();

      // ✅ حماية من null
      setNotifications(res.data.data || []);
    } catch (err) {
      console.error(err);
      setNotifications([]); // fallback
    }
  };

  useEffect(() => {
    fetchNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const markAsRead = async (id) => {
    try {
      await settingsAPI.markAsRead(id);
      fetchNotifications(); // refresh
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Notifications</h2>

      {/* ✅ حماية إضافية */}
      {(notifications || []).length === 0 ? (
        <p>No notifications</p>
      ) : (
        (notifications || []).map((n) => (
          <div
            key={n.id}
            style={{
              border: "1px solid #ddd",
              padding: "10px",
              marginBottom: "10px",
              background: n.read_at ? "#f5f5f5" : "#fff",
            }}
          >
            <p>{n.message}</p>

            {!n.read_at && (
              <button onClick={() => markAsRead(n.id)}>
                Mark as read
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default Notifications;