import { BrowserRouter, Routes, Route } from "react-router-dom";

import AdminRoute from "./layouts/AdminRoute";
import ProtectedRoute from "./layouts/ProtectedRoutes";
import PublicLayout from "./layouts/PublicLayout";
import DashboardLayout from "./layouts/DashboardLayout";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Home from "./pages/public/Home";
import Menu from "./pages/public/Menu";
import About from "./pages/public/About";
import Contact from "./pages/public/Contact";
import Articles from "./pages/public/Articles";
import Cart from "./pages/private/Cart";
import Profile from "./pages/private/Profile";
import Checkout from "./pages/private/Checkout";

import Dashboard from "./pages/dashboard/Dashboard";
import MenuItems from "./pages/dashboard/MenuItems";
import Categories from "./pages/dashboard/Categories";
import Orders from "./pages/dashboard/Orders";
import Bookings from "./pages/dashboard/Bookings";
import Users from "./pages/dashboard/Users";
import AdminProfile from "./pages/dashboard/AdminProfile";
import Blogs from "./pages/dashboard/Blogs";
import Messages from "./pages/dashboard/Messages";
import ArticleDetails from "./pages/public/ArticleDetails";
import Booking from "./pages/private/Booking";
import NotificationsPage from "./components/Notification";
import UserOnlyRoute from "./layouts/UserRoute";

import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/index.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* public pages */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="menu" element={<Menu />} />
          <Route path="articles" element={<Articles />} />
          <Route path="articles/:id" element={<ArticleDetails />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          {/* private pages */}
          <Route element={<ProtectedRoute />}>
            <Route element={<UserOnlyRoute />}>
              <Route path="cart" element={<Cart />} />
              <Route path="checkout" element={<Checkout />} />
            </Route>
            <Route path="booking" element={<Booking />} />
            <Route path="profile" element={<Profile />} />
            <Route path="notifications" element={<NotificationsPage />} />
          </Route>
        </Route>
        {/* Admin dashboard routes */}
        <Route path="/dashboard" element={<AdminRoute><DashboardLayout /></AdminRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="orders" element={<Orders />} />
          <Route path="bookings" element={<Bookings />} />
          <Route path="menu" element={<MenuItems />} />
          <Route path="categories" element={<Categories />} />
          <Route path="blogs" element={<Blogs />} />
          <Route path="users" element={<Users />} />
          <Route path="messages" element={<Messages />} />
          <Route path="profile" element={<AdminProfile />} />
          <Route path="notifications" element={<NotificationsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
