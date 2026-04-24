import React, { useEffect, useMemo, useState } from "react";
import { useNotifications } from "../context/NotificationsContext";
import { useToast } from "../context/ToastContext";
import { FaCheckCircle, FaTrash } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";

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
  const {
    notifications,
    fetchNotifications,
    markAsRead,
    deleteNotification,
  } = useNotifications();

  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        await fetchNotifications();
      } catch {
        showToast("error", "Failed to load notifications");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const sortedNotifications = useMemo(() => {
    return [...notifications].sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );
  }, [notifications]);

  const filtered = useMemo(() => {
    if (filter === "unread")
      return sortedNotifications.filter((n) => !n.is_read);

    if (filter === "read")
      return sortedNotifications.filter((n) => n.is_read);

    return sortedNotifications;
  }, [filter, sortedNotifications]);

  return (
    <div className="notif-page">

      <div className="notif-page-header">
        <h2>Notifications</h2>
        <p>Stay updated with your latest activity</p>
      </div>

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

      <div className="notif-page-body">

        {loading ? (
          <div className="notif-empty">Loading...</div>

        ) : filtered.length === 0 ? (
          <div className="notif-empty">No notifications</div>

        ) : (
          filtered.map((note) => (
            <div
              key={note.id}
              className={`notif-card ${note.is_read ? "read" : "unread"}`}
              onClick={() => markAsRead(note.id)}
            >

              <div className="notif-card-title">
                {!note.is_read && <span className="dot" />}
                {"Notification"}
              </div>
              
                <button
                  className="notification-delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNotification(note.id);
                  }}
                >
                  <FaXmark />
                </button>

              <p className="notif-card-msg">
                {note.message}
              </p>

              <small className="notif-time">
                {formatTime(note.created_at || note.updated_at)}
              </small>

              <div className="notif-actions">
                {note.is_read}
              </div>

            </div>
          ))
        )}

      </div>
    </div>
  );
}

export default NotificationsPage;