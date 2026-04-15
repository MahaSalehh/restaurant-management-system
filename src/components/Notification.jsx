import React, { useState, useEffect } from "react";
import { FaBell } from "react-icons/fa";
import { FaX } from "react-icons/fa6";
import { settingsAPI } from "../service/api";
import { useToast } from "../context/ToastContext";

function NotificationSidebar() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const { showToast } = useToast();

  // ================= FETCH =================
  const fetchNotifications = async () => {
    try {
      setLoading(true);

      const res = await settingsAPI.getNotifications();

      const notes = res.data?.data || [];

      const formatted = notes.map((n) => ({
        ...n,
        read: Boolean(n.read || n.is_read),
      }));

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

  // ================= MARK AS READ =================
  const markAsRead = async (id) => {
    try {
      await settingsAPI.markAsRead(id);

      setNotifications((prev) =>
        prev.map((n) =>
          n.id === id ? { ...n, read: true } : n
        )
      );

    } catch {
      showToast("error", "Failed to update notification");
    }
  };

  // ================= UNREAD COUNT (DERIVED STATE) =================
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <>
      {/* BELL BUTTON */}
      <div className="notif-wrapper">

        <button
          className="notif-btn"
          onClick={() => setOpen(true)}
        >
          <span className="icon-btn">
            <FaBell />
          </span>

          {unreadCount > 0 && (
            <span className="notif-badge">
              {unreadCount}
            </span>
          )}

        </button>

      </div>

      {/* OVERLAY */}
      {open && (
        <div
          className="notif-overlay"
          onClick={() => setOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <div className={`notif-sidebar ${open ? "open" : ""}`}>

        {/* HEADER */}
        <div className="notif-sidebar-header">

          <h5>Notifications</h5>

          <button onClick={() => setOpen(false)}>
            <FaX />
          </button>

        </div>

        {/* BODY */}
        <div className="notif-sidebar-body">

          {loading ? (
            <div className="notif-empty">
              Loading...
            </div>

          ) : notifications.length === 0 ? (
            <div className="notif-empty">
              No notifications yet
            </div>

          ) : (
            notifications.map((note) => (
              <div
                key={note.id}
                className={`notif-item ${
                  note.read ? "read" : "unread"
                }`}
                onClick={() => markAsRead(note.id)}
              >

                <div className="notif-title">
                  {!note.read && <span className="dot" />}
                  {note.title}
                </div>

                <small className="notif-msg">
                  {note.message}
                </small>

              </div>
            ))
          )}

        </div>

      </div>
    </>
  );
}

export default NotificationSidebar;