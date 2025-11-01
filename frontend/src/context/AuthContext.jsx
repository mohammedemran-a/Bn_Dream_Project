import { createContext, useContext, useState, useEffect } from "react";
import { login as apiLogin, register as apiRegister, getUser as apiGetUser, logout as apiLogout } from "@/api/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return logout(); // لا يوجد توكن، خروج آمن
    }

    try {
      const response = await apiGetUser();
      const data = response.data;

      if (!data || !data.user) {
        return logout(); // بيانات المستخدم غير صالحة
      }

      setUser(data.user);
      setPermissions(data.permissions || []);
    } catch (error) {
      console.error("Session check failed:", error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const login = async (credentials) => {
    const response = await apiLogin(credentials);
    if (!response.data) throw new Error("Login failed");

    localStorage.setItem("token", response.data.token);
    await fetchUser();
    return response.data.user;
  };

  const register = async (userData) => {
    const response = await apiRegister(userData);
    if (!response.data) throw new Error("Register failed");

    localStorage.setItem("token", response.data.token);
    await fetchUser();
    return response.data.user;
  };

  const logout = async () => {
    try {
      await apiLogout();
    } catch (error) {
      console.warn("Logout failed:", error);
    } finally {
      localStorage.removeItem("token");
      setUser(null);
      setPermissions([]);
    }
  };

  const hasPermission = (permission) => {
    return permissions.includes(permission);
  };

  return (
    <AuthContext.Provider
      value={{ user, permissions, loading, login, register, logout, hasPermission }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
