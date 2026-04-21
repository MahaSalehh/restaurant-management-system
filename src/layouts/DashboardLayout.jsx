import { useState } from "react";
import { Container, Navbar } from "react-bootstrap";
import { Link, useLocation, Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  FaHome,
  FaShoppingCart,
  FaUtensils,
  FaTags,
  FaNewspaper,
  FaUsers,
  FaEnvelope,
  FaCalendarCheck,
  FaBell,
  FaUser,
  FaShoppingBag,
  FaBars,
} from "react-icons/fa";
import { useNotifications } from "../context/NotificationsContext";
import { FaAnglesRight } from "react-icons/fa6";

function DashboardLayout() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const notifContext = useNotifications();
  const unreadCount = notifContext?.unreadCount || 0;

  const isActive = (path) => location.pathname === path;

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  const menu = [
  { path: "/dashboard", label: "Overview", icon: <FaHome /> },
  { path: "/dashboard/orders", label: "Orders", icon: <FaShoppingCart /> },
  { path: "/dashboard/bookings", label: "Bookings", icon: <FaCalendarCheck /> },
  { path: "/dashboard/menu", label: "Menu", icon: <FaUtensils /> },
  { path: "/dashboard/categories", label: "Categories", icon: <FaTags /> },
  { path: "/dashboard/blogs", label: "Articles", icon: <FaNewspaper /> },
  { path: "/dashboard/users", label: "Users", icon: <FaUsers /> },
  { path: "/dashboard/messages", label: "Messages", icon: <FaEnvelope /> },
];

  return (
    <div className="dash-layout">

      <aside
        className={`
          dash-sidebar
          ${collapsed ? "collapsed" : ""}
          ${mobileOpen ? "open" : ""}
        `}
      >
        <div className="sidebar-top">
          <button
            className="icon-btn"
            onClick={() => {
              if (window.innerWidth <= 768) {
                setMobileOpen(!mobileOpen);
              } else {
                setCollapsed(!collapsed);
              }
            }}
          >
            <FaAnglesRight />
          </button>
        </div>

        <nav className="sidebar-menu">
          {menu.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`side-link ${isActive(item.path) ? "active" : ""}`}
            >
              <span className="icon">{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>
      </aside>

      <div className="dash-main">

        <header className="dash-topbar">

          <button
            className="icon-btn mobile-toggle"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <FaBars />
          </button>

          <Navbar.Brand as={Link} to="/dashboard" className="brand">
            Dashboard
          </Navbar.Brand>

          <div className="top-actions">

            <Link to="/dashboard/notifications" className="icon-btn notif-icon">
              <div className="icon-badge-wrapper">
                <FaBell />
                {unreadCount > 0 && (
                  <span className="notif-badge">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </div>
            </Link>

            <Link to="/dashboard/profile" className="icon-btn">
              <FaUser />
            </Link>

          </div>

        </header>

        <main className="dash-content">
          <Container fluid>
            <Outlet />
          </Container>
        </main>

      </div>

    </div>
  );
}

export default DashboardLayout;