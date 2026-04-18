import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const STORAGE_URL =
  API_BASE_URL.replace("/api", "") + "/storage/";

export const api = axios.create({
  baseURL: API_BASE_URL,
});

// ==========================
// Request Interceptor (Token + Headers handling)
// ==========================
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("ACCESS_TOKEN");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // ✅ Important: don't force JSON when sending FormData
    if (!(config.data instanceof FormData)) {
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ==========================
// Response Interceptor (401)
// ==========================
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("ACCESS_TOKEN");
    }
    return Promise.reject(error);
  }
);



// ==========================
// AUTH
// ==========================
export const authAPI = {
  register: (data) => api.post("/register", data),
  login: (data) => api.post("/login", data),
  logout: () => api.post("/logout"),
};



// ==========================
// PROFILE + NOTIFICATIONS
// ==========================
export const settingsAPI = {
  getProfile: () => api.get("/profile"),
  updateProfile: (data) => api.put("/profile", data),

  getNotifications: () => api.get("/notifications"),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  deleteNotification: (id) => api.delete(`/notifications/${id}`),
};



// ==========================
// PUBLIC
// ==========================
export const publicAPI = {
  getCategories: () => api.get("/categories"),
  getCategory: (id) => api.get(`/categories/${id}`),

  getMenuItems: () => api.get("/menu-items"),
  getMenuItem: (id) => api.get(`/menu-items/${id}`),

  getArticles: () => api.get("/articles"),
  getArticle: (id) => api.get(`/articles/${id}`),
};



// ==========================
// CART
// ==========================
export const cartAPI = {
  getCart: () => api.get("/cart"),
  getCartCount: () => axios.get("/cart/count"),
  addItem: (data) => api.post("/cart/items", data),
  updateItem: (id, data) => api.patch(`/cart/items/${id}`, data),
  removeItem: (id) => api.delete(`/cart/items/${id}`),
  clearCart: () => api.delete("/cart/clear"),
};



// ==========================
// ORDERS
// ==========================
export const orderAPI = {
  create: (data) => api.post("/orders", data),
  myOrders: () => api.get("/my-orders"),
  getById: (id) => api.get(`/orders/${id}`),
};



// ==========================
// BOOKINGS
// ==========================
export const bookingAPI = {
  create: (data) => api.post("/bookings", data),
  myBookings: () => api.get("/bookings/me"),
  getById: (id) => api.get(`/bookings/${id}`),
};



// ==========================
// CONTACT
// ==========================
export const contactAPI = {
  send: (data) => api.post("/contacts", data),
};



// ==========================
// ADMIN
// ==========================
export const adminAPI = {

  // ---------- USERS ----------
  getUsers: () => api.get("/admin/users"),
  updateUserRole: (id, data) =>
    api.put(`/admin/users/${id}/role`, data),
  deleteUser: (id) =>
    api.delete(`/admin/users/${id}`),
  restoreUser: (id) =>
    api.post(`/admin/users/${id}/restore`),

  // ---------- CATEGORIES ----------
  createCategory: (data) =>
    api.post("/admin/categories", data),
  updateCategory: (id, data) =>
    api.put(`/admin/categories/${id}`, data),
  deleteCategory: (id) =>
    api.delete(`/admin/categories/${id}`),

  // ---------- MENU ITEMS (WITH IMAGE) ----------
  createMenuItem: (data) =>
    api.post("/admin/menu-items", data), // supports FormData

  updateMenuItem: (id, data) =>
    api.post(`/admin/menu-items/${id}?_method=PUT`, data), // for FormData

  deleteMenuItem: (id) =>
    api.delete(`/admin/menu-items/${id}`),

  // ---------- ARTICLES (WITH IMAGE) ----------
  createArticle: (data) =>
    api.post("/admin/articles", data), // FormData supported

  updateArticle: (id, data) =>
    api.post(`/admin/articles/${id}?_method=PUT`, data), // FormData

  deleteArticle: (id) =>
    api.delete(`/admin/articles/${id}`),

  // ---------- ORDERS ----------
  getAllOrders: () => api.get("/admin/orders"),
  updateOrderStatus: (id, data) =>
    api.put(`/admin/orders/${id}/status`, data),
  deleteOrder: (id) =>
    api.delete(`/admin/orders/${id}`),

  // ---------- BOOKINGS ----------
  getAllBookings: () => api.get("/admin/bookings"),
  getBooking: (id) =>
    api.get(`/admin/bookings/${id}`),
  updateBookingStatus: (id, data) =>
    api.put(`/admin/bookings/${id}/status`, data),
  deleteBooking: (id) =>
    api.delete(`/admin/bookings/${id}`),
};

export default api;