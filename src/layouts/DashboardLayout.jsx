import { useState } from "react";
import {
  Container,
  Navbar,
  Nav,
  Offcanvas,
  Button,
} from "react-bootstrap";
import { Link, useLocation, Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useNotifications } from "../context/NotificationsContext";
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
  FaBars,
} from "react-icons/fa";

function DashboardLayout() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  const [showMenu, setShowMenu] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const notifContext = useNotifications();
  const unreadCount = notifContext?.unreadCount || 0;

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

  const isActive = (path) => location.pathname === path;

  return (
    <div className="dash-layout">

      <Navbar className="dash-topbar">

        <Button
          className="menu-btn d-lg-none"
          onClick={() => setShowMenu(true)}
        >
          <FaBars />
        </Button>

        <Navbar.Brand as={Link} to="/dashboard" className="brand">
          Dashboard
        </Navbar.Brand>

        <Nav className="tabs-nav d-none d-lg-flex">
          {menu.map((item) => (
            <Nav.Link
              as={Link}
              to={item.path}
              key={item.path}
              className={isActive(item.path) ? "active-tab" : ""}
            >
              {item.label}
            </Nav.Link>
          ))}
        </Nav>

        <div className="top-actions">

          <button className="icon-btn" onClick={() => setNotifOpen(true)}>
            <div className="icon-badge-wrapper">
              <FaBell />
              {unreadCount > 0 && (
                <span className="notif-badge">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </div>
          </button>

          <Link to="/dashboard/profile" className="profile">
            <FaUser />
          </Link>

        </div>
      </Navbar>

      <Offcanvas
        show={showMenu}
        onHide={() => setShowMenu(false)}
        placement="start"
        className="mobile-menu"
      >
        <Offcanvas.Header closeButton />
        <Offcanvas.Body>
          <Nav className="flex-column">
            {menu.map((item) => (
              <Nav.Link
                as={Link}
                to={item.path}
                key={item.path}
                onClick={() => setShowMenu(false)}
                className={isActive(item.path) ? "active-tab" : ""}
              >
                {item.icon} <span className="ms-2">{item.label}</span>
              </Nav.Link>
            ))}
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>

      <div className={`notif-sidebar ${notifOpen ? "open" : ""}`}>
        <div className="notif-header">
          <h5>Notifications</h5>
          <button className="icon-btn" onClick={() => setNotifOpen(false)}>✕</button>
        </div>

        <div className="notif-body">
          {notifContext?.notifications?.length ? (
            notifContext.notifications.map((n, i) => (
              <div key={i} className="notif-item">
                <p>{n.message}</p>
                <span>{n.time}</span>
              </div>
            ))
          ) : (
            <p>No notifications</p>
          )}
        </div>
      </div>

      <main className="dash-content">
        <Container fluid>
          <Outlet />
        </Container>
      </main>

    </div>
  );
}

export default DashboardLayout;