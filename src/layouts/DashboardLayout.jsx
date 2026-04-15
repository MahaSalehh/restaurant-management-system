import { useState } from "react";
import { Container, Navbar } from "react-bootstrap";
import { Link, useLocation, Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  FaUser,
  FaHome,
  FaShoppingBag,
  FaShoppingCart,
  FaUsers,
  FaBars,
} from "react-icons/fa";
import Notification from "../components/Notification";
function DashboardLayout() {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  const [collapsed, setCollapsed] = useState(false);
  const isActive = (path) => location.pathname === path;

  // 🔐 حماية الداشبورد
  if (!isAuthenticated) {
    return <Navigate to="/login" replace/>;
  }

  return (
    <div className="d-flex">

      {/* ===== Sidebar ===== */}
      <div
        style={{
          width: collapsed ? "70px" : "220px",
          minHeight: "100vh",
          background: "#fff",
          borderRight: "1px solid #ddd",
          transition: "0.3s",
        }}
        className="p-3"
      >
        <button
          className="btn btn-light mb-4"
          onClick={() => setCollapsed(!collapsed)}
        >
          <FaBars />
        </button>

        <div className="d-flex flex-column align-items-start gap-3 ">

          <Link
            to="/dashboard"
            className={`nav-link ${isActive("/dashboard") && "active"}`}
          >
            <FaHome /> {!collapsed && " Dashboard"}
          </Link>

          <Link
            to="/dashboard/orders"
            className={`nav-link ${isActive("/dashboard/orders") && "active"}`}
          >
            <FaShoppingCart /> {!collapsed && " Orders"}
          </Link>

          <Link
            to="/dashboard/bookings"
            className={`nav-link ${isActive("/dashboard/bookings") && "active"}`}
          >
            <FaShoppingCart /> {!collapsed && " Bookings"}
          </Link>

          <Link
            to="/dashboard/menu"
            className={`nav-link ${isActive("/dashboard/menu") && "active"}`}
          >
            <FaShoppingBag /> {!collapsed && " Menu"}
          </Link>

          <Link
            to="/dashboard/categories"
            className={`nav-link ${isActive("/dashboard/categories") && "active"}`}
          >
            <FaShoppingCart /> {!collapsed && " Categories"}
          </Link>

          <Link
            to="/dashboard/blogs"
            className={`nav-link ${isActive("/dashboard/blogs") && "active"}`}
          >
            <FaShoppingCart /> {!collapsed && " Articles"}
          </Link>

          <Link
            to="/dashboard/users"
            className={`nav-link ${isActive("/dashboard/users") && "active"}`}
          >
            <FaUsers /> {!collapsed && " Users"}
          </Link>
          <Link
            to="/dashboard/messages"
            className={`nav-link ${isActive("/dashboard/messages") && "active"}`}
          >
            <FaShoppingCart /> {!collapsed && " Messages"}
          </Link>


        </div>
      </div>

      {/* ===== Main Content ===== */}
      <div className="flex-grow-1">

  {/* ===== Top Navbar ===== */}
  <div
    style={{
      height: "60px",
      background: "#fff",
      borderBottom: "1px solid #ddd",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 20px",
      position: "sticky",
      top: 0,
      zIndex: 999,
    }}
  >
    <Navbar.Brand as={Link} to="/dashboard">
      <span style={{ fontWeight: "700" , fontSize: "24px" }}>Dashboard</span>
    </Navbar.Brand>

    <div className="d-flex align-items-center gap-3">
      {/* 🔔 Notifications */}
      <Notification />

      {/* 👤 User */}
      <div  style={{ fontWeight: "500" }}>
        <Link
            to="/dashboard/admin/profile"
            className={`nav-link`}
          >
            <FaUser /> {!collapsed && (user?.name )}
          </Link>
      </div>
    </div>
  </div>

  {/* ===== Page Content ===== */}
  <Container className="my-4">
    <Outlet />
  </Container>
</div>

    </div>
  );
}

export default DashboardLayout;