import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Spinner, Container } from "react-bootstrap";

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading, user } = useAuth();
  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" />
      </Container>
    );
  }

  if (!isAuthenticated) {
    return  <Navigate to="/login" replace />
    
  }

  // ❗ لو admin حاول يدخل private user pages → نمنعه أو نسيبه حسب تصميمك
  if (user?.role === "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default ProtectedRoute;