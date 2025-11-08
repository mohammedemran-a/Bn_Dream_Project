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

// // ==========================================================
// // 🔹 جلب جميع المستخدمين (خاص بالمشرف)
// // ==========================================================
// export const getAllUsers = async () => {
//   const token = localStorage.getItem("token");
//   if (!token) return [];

//   try {
//     const response = await axios.get("/api/users", {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     return response.data;
//   } catch (error) {
//     throw error.response?.data || { message: "فشل جلب بيانات المستخدمين" };
//   }
// };

// // ==========================================================
// // 🔹 إنشاء مستخدم جديد (من لوحة التحكم - بواسطة المشرف)
// // ==========================================================
// export const createUser = async (data) => {
//   const token = localStorage.getItem("token");
//   if (!token) throw { message: "يجب تسجيل الدخول أولاً" };

//   try {
//     const response = await axios.post("/api/users", data, {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     return response.data;
//   } catch (error) {
//     throw error.response?.data || { message: "فشل في إنشاء المستخدم" };
//   }
// };

// // ==========================================================
// // 🔹 تعديل بيانات مستخدم (اختياري للاستخدام لاحقًا)
// // ==========================================================
// export const updateUser = async (id, data) => {
//   const token = localStorage.getItem("token");
//   if (!token) throw { message: "يجب تسجيل الدخول أولاً" };

//   try {
//     const response = await axios.put(`/api/users/${id}`, data, {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     return response.data;
//   } catch (error) {
//     throw error.response?.data || { message: "فشل في تحديث المستخدم" };
//   }
// };

// // ==========================================================
// // 🔹 حذف مستخدم (اختياري للاستخدام لاحقًا)
// // ==========================================================
// export const deleteUser = async (id) => {
//   const token = localStorage.getItem("token");
//   if (!token) throw { message: "يجب تسجيل الدخول أولاً" };

//   try {
//     const response = await axios.delete(`/api/users/${id}`, {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     return response.data;
//   } catch (error) {
//     throw error.response?.data || { message: "فشل في حذف المستخدم" };
//   }
// };