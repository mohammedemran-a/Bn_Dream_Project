import axios from "./axios";

// تسجيل مستخدم جديد
export const register = async (data) => {
  const response = await axios.post("/api/register", data);
  return response.data ? response : { data: null };
};

// تسجيل الدخول
export const login = async (data) => {
  const response = await axios.post("/api/login", data);

  // حفظ التوكن في localStorage
  const token = response.data?.token;
  if (token) {
    localStorage.setItem("token", token);
  }

  return response.data ? response : { data: null };
};

// تسجيل الخروج
export const logout = async () => {
  return await axios.post("/api/logout");
};

// جلب بيانات المستخدم الحالي
export const getUser = async () => {
  const response = await axios.get("/api/user");
  return response.data ? response : { data: null };
};
