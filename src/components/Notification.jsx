import React, { useEffect, useState } from "react";
import { settingsAPI } from "../service/api";
import { useToast } from "../context/ToastContext";
import { FaCheckCircle } from "react-icons/fa";

/* ================= TIME FORMAT ================= */
const formatTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();

  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return "Just now";

  if (diffMins < 60)
    return `${diffMins} min${diffMins > 1 ? "s" : ""} ago`;

  if (diffHours < 24)
    return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;

  if (diffDays === 1) return "Yesterday";

  return date.toLocaleDateString();
};

function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const { showToast } = useToast();

  /* ================= FETCH ================= */
  const fetchNotifications = async () => {
    try {
      setLoading(true);

      const res = await settingsAPI.getNotifications();
      const data = res.data?.data || [];

      const formatted = data.map((n) => ({
        ...n,
        is_read: n.is_read === true || n.is_read === 1 || n.is_read === "true",
      }));

      /* SORT: NEWEST FIRST */
      formatted.sort(
        (a, b) =>
          new Date(b.created_at) - new Date(a.created_at)
      );

      setNotifications(formatted);
    } catch {
      showToast("error", "Failed to load notifications");
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  /* ================= MARK AS READ ================= */
  const markAsRead = async (id) => {
    try {
      await settingsAPI.markAsRead(id);

      setNotifications((prev) =>
        prev.map((n) =>
          n.id === id ? { ...n, is_read: true } : n
        )
      );
    } catch {
      showToast("error", "Failed to update notification");
    }
  };

  /* ================= FILTER ================= */
  const filtered = notifications.filter((n) => {
    if (filter === "unread") return !n.is_read;
    if (filter === "read") return n.is_read;
    return true;
  });

  return (
    <div className="notif-page">

      {/* HEADER */}
      <div className="notif-page-header">
        <h2>Notifications</h2>
        <p>Stay updated with your latest activity</p>
      </div>

      {/* FILTER */}
      <div className="notif-filter">
        <button
          className={filter === "all" ? "active" : ""}
          onClick={() => setFilter("all")}
        >
          All
        </button>

        <button
          className={filter === "unread" ? "active" : ""}
          onClick={() => setFilter("unread")}
        >
          Unread
        </button>

        <button
          className={filter === "read" ? "active" : ""}
          onClick={() => setFilter("read")}
        >
          Read
        </button>
      </div>

      {/* LIST */}
      <div className="notif-page-body">

        {loading ? (
          <div className="notif-empty">Loading...</div>

        ) : filtered.length === 0 ? (
          <div className="notif-empty">No notifications</div>

        ) : (
          filtered.map((note) => (
            <div
              key={note.id}
              className={`notif-card ${
                note.is_read ? "read" : "unread"
              }`}
              onClick={() => markAsRead(note.id)}
            >

              {/* TITLE */}
              <div className="notif-card-title">
                {!note.is_read && <span className="dot" />}
                {note.title}
              </div>

              {/* MESSAGE */}
              <p className="notif-card-msg">
                {note.message}
              </p>

              {/* TIME */}
              <small className="notif-time">
                {formatTime(
                  note.created_at || note.updated_at
                )}
              </small>

              {/* READ ICON */}
              {note.is_read && (
                <FaCheckCircle className="read-icon" />
              )}

            </div>
          ))
        )}

      </div>
    </div>
  );
}

export default NotificationsPage;