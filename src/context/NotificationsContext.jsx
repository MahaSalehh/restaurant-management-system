import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { settingsAPI } from "../service/api";
import { useAuth } from "./AuthContext";

const NotificationContext = createContext(null);

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const { token } = useAuth();
  const [notifications, setNotifications] = useState([]);

  // 🔹 Normalize data (important for consistency)
  const normalize = (n) => ({
    ...n,
    is_read:
      n.is_read === true ||
      n.is_read === 1 ||
      n.is_read === "true",
  });

  // 🔹 Fetch notifications
  const fetchNotifications = useCallback(async () => {
    try {
      const res = await settingsAPI.getNotifications();

      const data = Array.isArray(res.data?.data)
        ? res.data.data
        : [];

      setNotifications(data.map(normalize));
    } catch (err) {
      console.error("Fetch notifications error:", err);
    }
  }, []);

  // 🔹 Mark as read (optimistic update)
  const markAsRead = async (id) => {
    const prev = notifications;

    setNotifications((old) =>
      old.map((n) =>
        n.id === id ? { ...n, is_read: true } : n
      )
    );

    try {
      await settingsAPI.markAsRead(id);
    } catch (err) {
      console.error("Mark as read error:", err);
      setNotifications(prev); // rollback
    }
  };

  // 🔹 Delete notification (optimistic update)
  const deleteNotification = async (id) => {
    const prev = notifications;

    setNotifications((old) =>
      old.filter((n) => n.id !== id)
    );

    try {
      await settingsAPI.deleteNotification(id);
    } catch (err) {
      console.error("Delete notification error:", err);
      setNotifications(prev); // rollback
    }
  };

  // 🔹 Unread count (auto derived)
  const unreadCount = notifications.reduce(
    (acc, n) => acc + (!n.is_read ? 1 : 0),
    0
  );

  // 🔹 Initial fetch + polling
  useEffect(() => {
    if (!token) return;

    fetchNotifications();

    const interval = setInterval(() => {
      fetchNotifications();
    }, 5000);

    return () => clearInterval(interval);
  }, [token, fetchNotifications]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        deleteNotification,
        fetchNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};