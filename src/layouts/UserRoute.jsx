import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function UserOnlyRoute() {
    const { user } = useAuth();

    if (user?.role === "admin") {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}

export default UserOnlyRoute;