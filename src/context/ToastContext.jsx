import { createContext, useContext, useState, useCallback } from "react";

const ToastContext = createContext(null);

// ✅ Hook آمن
export const useToast = () => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used inside ToastProvider");
  }

  return context;
};

let idCounter = 0;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  // ✅ show toast
  const showToast = useCallback((type, message, duration = 3000) => {
    const id = idCounter++;

    const newToast = {
      id,
      type, // success | error | info
      message,
    };

    setToasts((prev) => [...prev, newToast]);

    // auto remove
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  // ✅ manual remove
  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* 🔔 Toast Container */}
      <div className="toast-container-custom">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`toast-card ${t.type}`}
            onClick={() => removeToast(t.id)}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};