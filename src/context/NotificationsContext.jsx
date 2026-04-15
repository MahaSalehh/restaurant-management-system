import { createContext, useContext, useEffect, useState } from "react";
import { settingsAPI } from "../service/api";

const NotificationContext = createContext(null);

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  // ================= FETCH =================
  const fetchNotifications = async () => {
    try {
      const res = await settingsAPI.getNotifications();
      setNotifications(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  // ================= AUTO REFRESH =================
  useEffect(() => {
    fetchNotifications();

    const interval = setInterval(fetchNotifications, 5000);
    return () => clearInterval(interval);
  }, []);

  // ================= ACTIONS =================
  const markAsRead = async (id) => {
    try {
      await settingsAPI.markAsRead(id);

      // ✅ Optimistic update
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === id ? { ...n, is_read: true } : n
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  const deleteNotification = async (id) => {
    try {
      await settingsAPI.deleteNotification(id);

      setNotifications((prev) =>
        prev.filter((n) => n.id !== id)
      );
    } catch (err) {
      console.error(err);
    }
  };

  // ================= DERIVED =================
  const unreadCount = notifications.filter(
    (n) => !n.is_read
  ).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        deleteNotification,
        refresh: fetchNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};