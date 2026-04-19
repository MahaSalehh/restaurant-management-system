import { Container, Navbar, Nav, Offcanvas } from "react-bootstrap";
import { Link, useLocation, Outlet } from "react-router-dom";
import {
  FaUser,
  FaBell,
  FaShoppingCart,
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaGithub
} from "react-icons/fa";
import { FiPhone } from "react-icons/fi";
import { FaRegEnvelope } from "react-icons/fa6";

import { useAuth } from "../context/AuthContext";
import { useNotifications } from "../context/NotificationsContext";

import logo from "../assets/logo.svg";
import Footer from "../components/Footer";
import ScrollTopBtn from "../components/ScrollTopBtn";
import Loader from "../components/Loader";

import { useEffect, useState } from "react";
import { cartAPI } from "../service/api";

function PublicLayout() {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  const notifContext = useNotifications();
  const unreadCount = notifContext?.unreadCount || 0;

  const [cartCount, setCartCount] = useState(0);
  const [showSidebar, setShowSidebar] = useState(false);

  const isArticlesActive = location.pathname.startsWith("/articles");
  const isMenuPage = location.pathname === "/menu";
  const navbarClass = isMenuPage ? "bg-white" : "bg-light";

  const isActive = (path) => location.pathname === path;

  // close sidebar on route change
  useEffect(() => {
    setShowSidebar(false);
  }, [location.pathname]);

  // fetch cart count
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await cartAPI.getCart();
        const items = res.data?.data?.cart_items || [];

        const total = items.reduce(
          (sum, item) => sum + (item.quantity || 0),
          0
        );

        setCartCount(total);
      } catch {
        setCartCount(0);
      }
    };

    fetchCart();
    const interval = setInterval(fetchCart, 3000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <Loader />;

  return (
    <>
      {/* TOP BAR */}
      <Container fluid className="top-bar">
        <Container className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-3 body-md">
            <span><FiPhone /> (414) 857 - 0107</span>
            <span><FaRegEnvelope /> yummy@bistrobliss</span>
          </div>

          <div className="d-flex gap-2 align-items-center social-icons">
            <Link to="https://twitter.com"><FaTwitter /></Link>
            <Link to="https://facebook.com"><FaFacebook /></Link>
            <Link to="https://instagram.com"><FaInstagram /></Link>
            <Link to="https://github.com"><FaGithub /></Link>
          </div>
        </Container>
      </Container>

      {/* NAVBAR */}
      <Navbar expand="lg" sticky="top" className={`main-navbar ${navbarClass}`}>
        <Container className="d-flex align-items-center">

          {/* LEFT */}
          <div className="d-flex align-items-center gap-2">
            <Navbar.Toggle
  aria-controls="offcanvasNavbar"
  className="custom-toggler d-lg-none"
  onClick={() => setShowSidebar(true)}
/>
            <Navbar.Brand as={Link} to="/" className="navbar-center-brand">
              <img src={logo} alt="Logo" className="logo" />
              <span>Bistro Bliss</span>
            </Navbar.Brand>
          </div>

          {/* CENTER (DESKTOP ONLY) */}
          <Nav className="nav-center d-none d-lg-flex gap-3 body-md body-md-medium mx-auto">
            <Link to="/" className={`nav-link ${isActive("/") ? "active" : ""}`}>Home</Link>
            <Link to="/about" className={`nav-link ${isActive("/about") ? "active" : ""}`}>About</Link>
            <Link to="/menu" className={`nav-link ${isActive("/menu") ? "active" : ""}`}>Menu</Link>
            <Link to="/articles" className={`nav-link ${isArticlesActive ? "active" : ""}`}>Articles</Link>
            <Link to="/contact" className={`nav-link ${isActive("/contact") ? "active" : ""}`}>Contact</Link>

            {isAuthenticated && (
              <Link to="/booking" className="btn-custom btn-primary-custom btn-sm">
                Book A Table
              </Link>
            )}
          </Nav>

          {/* RIGHT */}
          <div className="d-flex align-items-center gap-3 ms-auto">
            {!isAuthenticated ? (
              <Link to="/login" className="btn-custom btn-outline-custom signin">
                Hello, Sign in
              </Link>
            ) : (
              <>
                <Link to="/cart" className="icon-btn cart-icon">
                  <div className="icon-badge-wrapper">
                    <FaShoppingCart />
                    {cartCount > 0 && (
                      <span className="notif-badge">
                        {cartCount > 99 ? "99+" : cartCount}
                      </span>
                    )}
                  </div>
                </Link>

                <Link to="/notifications" className="icon-btn notif-icon">
                  <div className="icon-badge-wrapper">
                    <FaBell />
                    {unreadCount > 0 && (
                      <span className="notif-badge">
                        {unreadCount > 99 ? "99+" : unreadCount}
                      </span>
                    )}
                  </div>
                </Link>

                <Link to="/profile" className="icon-btn">
                  <FaUser />
                </Link>
              </>
            )}
          </div>

        </Container>

        {/* OFFCANVAS (MOBILE ONLY) */}
        <Navbar.Offcanvas
          id="offcanvasNavbar"
          placement="start"
          className="d-lg-none"
          show={showSidebar}
          onHide={() => setShowSidebar(false)}
        >
          <Offcanvas.Header closeButton />

          <Offcanvas.Body>
            <Nav className="flex-column gap-3 body-md body-md-medium">

              <Link onClick={() => setShowSidebar(false)} to="/" className={`nav-link ${isActive("/") ? "active" : ""}`}>Home</Link>
              <Link onClick={() => setShowSidebar(false)} to="/about" className={`nav-link ${isActive("/about") ? "active" : ""}`}>About</Link>
              <Link onClick={() => setShowSidebar(false)} to="/menu" className={`nav-link ${isActive("/menu") ? "active" : ""}`}>Menu</Link>
              <Link onClick={() => setShowSidebar(false)} to="/articles" className={`nav-link ${isArticlesActive ? "active" : ""}`}>Articles</Link>
              <Link onClick={() => setShowSidebar(false)} to="/contact" className={`nav-link ${isActive("/contact") ? "active" : ""}`}>Contact</Link>

              {isAuthenticated && (
                <Link
                  to="/booking"
                  onClick={() => setShowSidebar(false)}
                  className="btn-custom btn-primary-custom btn-sm"
                >
                  Book A Table
                </Link>
              )}

            </Nav>
          </Offcanvas.Body>
        </Navbar.Offcanvas>

      </Navbar>

      <Outlet />
      <Footer />
      <ScrollTopBtn />
    </>
  );
}

export default PublicLayout;