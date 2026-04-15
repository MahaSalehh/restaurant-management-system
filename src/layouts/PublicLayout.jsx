import { Container, Navbar, Nav, Button, Spinner} from "react-bootstrap";
import { Link, useLocation, Outlet } from "react-router-dom";
import { FaUser, FaShoppingCart, FaFacebook, FaInstagram, FaTwitter, FaGithub } from "react-icons/fa";
import { FiPhone } from "react-icons/fi";
import { FaRegEnvelope } from "react-icons/fa6";
import { useAuth } from '../context/AuthContext';
import logo from "../assets/logo.svg";
import Notification from "../components/Notification";
import Footer from "../components/Footer";
import ScrollTopBtn from "../components/ScrollTopBtn";

function PublicLayout() {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  const isMenuPage = location.pathname === "/menu";
  const navbarClass = isMenuPage ? "bg-white" : "bg-light";
  const isActive = (path) => location.pathname === path;
  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" />
        <p className="mt-3">Loading...</p>
      </Container>
    );
  }
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
      <Link to="https://twitter.com" target="_blank" rel="noreferrer"><FaTwitter /></Link>
      <Link to="https://facebook.com" target="_blank" rel="noreferrer"><FaFacebook /></Link>
      <Link to="https://instagram.com" target="_blank" rel="noreferrer"><FaInstagram /></Link>
      <Link to="https://github.com" target="_blank" rel="noreferrer"><FaGithub /></Link>
    </div>

  </Container>
</Container>

{/* NAVBAR */}
<Navbar expand="lg" sticky="top" className={`main-navbar ${navbarClass}`}>
  <Container>

    <Navbar.Brand as={Link} to="/" className="d-flex align-items-center gap-2">
      <img src={logo} alt="Logo" className="logo" />
      <span className="h3">Bistro Bliss</span>
    </Navbar.Brand>

    <Navbar.Toggle aria-controls="primary-navbar" />

    <Navbar.Collapse id="primary-navbar">

      <Nav className="mx-auto align-items-center gap-4 body-md body-md-medium">

        <Link to="/" className={`nav-link ${isActive("/") ? "active" : ""}`}>Home</Link>
        <Link to="/about" className={`nav-link ${isActive("/about") ? "active" : ""}`}>About</Link>
        <Link to="/menu" className={`nav-link ${isActive("/menu") ? "active" : ""}`}>Menu</Link>
        <Link to="/articles" className={`nav-link ${isActive("/articles") ? "active" : ""}`}>Articles</Link>
        <Link to="/contact" className={`nav-link ${isActive("/contact") ? "active" : ""}`}>Contact</Link>

      </Nav>

      <div className="d-flex align-items-center gap-3 mt-lg-0 mt-3">

        {!isAuthenticated ? (
          <Link to="/login" className="btn-custom btn-outline-custom btn-sm">
            Hello, Sign in
          </Link>
        ) : (
          <>
            <Link to="/cart" className="icon-btn">
              <FaShoppingCart />
            </Link>

            <Notification />

            <Link to="/profile" className="icon-btn">
              <FaUser />
            </Link>

            <Link to="/booking" className="btn-custom btn-primary-custom btn-sm">
              Book A Table
            </Link>
          </>
        )}

      </div>

    </Navbar.Collapse>

  </Container>
</Navbar>

      <Outlet />

      {/* ===== Footer ===== */}
      <div className="footer">
        <Footer />
      </div>
      {/* ===== SCROLL TO TOP BUTTON ===== */}
      <ScrollTopBtn />


    </>
  );
}

export default PublicLayout;