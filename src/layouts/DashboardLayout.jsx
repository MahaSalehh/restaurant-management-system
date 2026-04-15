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
  FaEnvelope,
  FaArrowRight,
} from "react-icons/fa";
import Notification from "../components/Notification";
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";

function DashboardLayout() {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
const [mobileOpen, setMobileOpen] = useState(false);
  const isActive = (path) => location.pathname === path;

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  const menu = [
    { path: "/dashboard", label: "Overview", icon: <FaHome /> },
    { path: "/dashboard/orders", label: "Orders", icon: <FaShoppingCart /> },
    { path: "/dashboard/bookings", label: "Bookings", icon: <FaShoppingCart /> },
    { path: "/dashboard/menu", label: "Menu", icon: <FaShoppingBag /> },
    { path: "/dashboard/categories", label: "Categories", icon: <FaShoppingCart /> },
    { path: "/dashboard/blogs", label: "Articles", icon: <FaShoppingCart /> },
    { path: "/dashboard/users", label: "Users", icon: <FaUsers /> },
    { path: "/dashboard/messages", label: "Messages", icon: <FaEnvelope /> },
  ];

  return (
    <div className="dash-layout">

      {/* SIDEBAR */}
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
  <FaArrowRight />
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

      {/* MAIN */}
      <div className="dash-main">

        {/* TOPBAR */}
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
    
    <Notification />

    <Link to="/dashboard/admin/profile" className="icon-btn">
      <FaUser />
    </Link>
  </div>
</header>

        {/* CONTENT */}
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