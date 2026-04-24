import { useState, useRef, useEffect } from "react";
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
  FaRegBell,
} from "react-icons/fa";
import { FaX, FaXmark } from "react-icons/fa6";

function DashboardLayout() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  const {
    notifications,
    unreadCount,
    markAsRead,
    deleteNotification,
    fetchNotifications,
  } = useNotifications();

  const [showMenu, setShowMenu] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const notifRef = useRef(null);
  useEffect(() => {
    function handleClickOutside(e) {
      if (
        notifOpen &&
        notifRef.current &&
        !notifRef.current.contains(e.target)
      ) {
        setNotifOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, [notifOpen]);

  useEffect(() => {
    if (notifOpen) fetchNotifications?.();
  }, [notifOpen]);

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
  const sortedNotifications = [...notifications].sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  );

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

        <Navbar.Brand as={Link} to="/dashboard" className="dash-brand">
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

          <button
            className="icon-btn icon-button"
            onClick={() => setNotifOpen((p) => !p)}
          >
            <div className="icon-badge-wrapper">
              <FaBell />
              {unreadCount > 0 && (
                <span className="notif-badge">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </div>
          </button>
          <Link
            to="/dashboard/profile"
            className="icon-btn icon-button profile"
          >
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
          <Nav className="mobile-nav flex-column">
            {menu.map((item) => (
              <Nav.Link
                as={Link}
                to={item.path}
                key={item.path}
                onClick={() => setShowMenu(false)}
                className={`nav-links ${isActive(item.path) ? "active-tab" : ""
                  }`}
              >
                {item.icon}
                <span className="ms-2">{item.label}</span>
              </Nav.Link>
            ))}
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>
      <div className="dash-body">
        <main className="dash-content">
          <Container>
            <Outlet />
          </Container>
        </main>

        <div className={`notif-overlay ${notifOpen ? "show" : ""}`}>
          <div
            ref={notifRef}
            className={`notif-panel ${notifOpen ? "open" : ""}`}
          >

            <div className="notif-header">
              <h5>Notifications</h5>

              <button
                className="icon-btn icon-button"
                onClick={() => setNotifOpen(false)}
              >
                <FaXmark />
              </button>
            </div>

            <div className="notif-body">
              {sortedNotifications.length ? (
                sortedNotifications.map((n) => (
                  <div
                    key={n.id}
                    className={`notif-item ${n.is_read ? "read" : "unread"
                      }`}
                    onClick={() => markAsRead(n.id)}
                  >

                    <div className="notif-icon">
                      <FaRegBell />
                    </div>

                    <div className="notif-content">

                      <div className="notif-top">
                        <div className="notif-title">
                          {n.title || "Notification"}
                        </div>

                        <button
                          className="notif-delete"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(n.id);
                          }}
                        >
                          <FaXmark />
                        </button>
                      </div>

                      <div className="notif-text">
                        {n.message}
                      </div>

                      <div className="notif-time">
                        {formatTime(n.created_at || n.updated_at)}
                      </div>

                    </div>

                  </div>
                ))
              ) : (
                <div className="text-muted p-2">
                  No notifications
                </div>
              )}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

export default DashboardLayout;