import { createContext, useState, useEffect, useContext } from "react";
import { authAPI, settingsAPI } from "../service/api";
const AuthContext = createContext(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [token, setToken] = useState(
    localStorage.getItem("ACCESS_TOKEN")
  );

  // ================= INIT =================
  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await settingsAPI.getProfile();
        setUser(res.data.data); // لازم يكون فيه role
      } catch (err) {
        localStorage.removeItem("ACCESS_TOKEN");
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token]);

  // ================= REGISTER =================
  const register = async (data) => {
    try {
      const res = await authAPI.register(data);

      return {
        success: true,
        message: res.data.message || "Registered successfully",
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Register failed",
      };
    }
  };

  // ================= LOGIN =================
  const login = async (credentials) => {
  try {
    const res = await authAPI.login(credentials);

    const accessToken = res.data.data.access_token;
    const user = res.data.data.user;

    if (!accessToken || !user) {
      return {
        success: false,
        error: res.data.message || "Invalid login response",
      };
    }

    localStorage.setItem("ACCESS_TOKEN", accessToken);
    setToken(accessToken);
    setUser(user);

    return {
      success: true,
      user,
      message: res.data.message,
    };
  } catch (error) {
  return {
    success: false,
    error:
      error.response?.data?.message || // ✅ your backend uses this
      "Something went wrong",
    errors: error.response?.data?.errors || null, // ✅ for validation
  };
}
};

  // ================= LOGOUT =================
const logout = async (navigate) => {
  try {
    await authAPI.logout();
  } catch (e) {}

  localStorage.removeItem("ACCESS_TOKEN");
  setToken(null);
  setUser(null);

  if (navigate) {
    navigate("/");
  } else {
  window.location.href = "/";
}
};

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
        register,
        isAuthenticated: !!token && !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;