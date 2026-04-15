import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Spinner, Container } from "react-bootstrap";

function AdminRoute({ children }) {
  const { user, isAuthenticated, loading } = useAuth();
  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" />
        <p className="mt-3">Loading...</p>
      </Container>
    );
  }

  // not logged in
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // logged in but not admin
  if (user?.role !== "admin") {

    return <Navigate to="/" replace />;
  }

  return children;
}

export default AdminRoute;