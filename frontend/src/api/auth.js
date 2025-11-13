import axios from "./axios";

// ==========================================================
// 🔹 تسجيل مستخدم جديد (عادي - أثناء التسجيل من الواجهة العامة)
// ==========================================================
export const register = async (data) => {
  try {
    const response = await axios.post("/api/register", data);
    const token = response?.data?.token;
    if (token) localStorage.setItem("token", token);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "خطأ في التسجيل" };
  }
};

// ==========================================================
// 🔹 تسجيل الدخول
// ==========================================================
export const login = async (data) => {
  try {
    const response = await axios.post("/api/login", data);
    const token = response?.data?.token;
    if (token) localStorage.setItem("token", token);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "خطأ في تسجيل الدخول" };
  }
};

// ==========================================================
// 🔹 تسجيل الخروج
// ==========================================================
export const logout = async () => {
  const token = localStorage.getItem("token");
  if (!token) return;

  try {
    await axios.post(
      "/api/logout",
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
  } catch (error) {
    throw error.response?.data || { message: "فشل تسجيل الخروج" };
  } finally {
    localStorage.removeItem("token");
  }
};

// ==========================================================
// 🔹 جلب بيانات المستخدم الحالي
// ==========================================================
export const getUser = async () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const response = await axios.get("/api/user", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "فشل جلب بيانات المستخدم" };
  }
};
