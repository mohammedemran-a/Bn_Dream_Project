import axios, { AxiosError } from "./axios";

export interface IUser {
  id: number;
  name: string;
  email: string;
  phone?: string;
  roles?: string[];
}

export interface UserFormData {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: string;
}

// واجهة عامة للخطأ من API
interface ApiError {
  message: string;
  [key: string]: unknown;
}

// ==========================================================
// 🔹 جلب جميع المستخدمين (خاص بالمشرف)
// ==========================================================
export const getAllUsers = async (): Promise<IUser[]> => {
  const token = localStorage.getItem("token");
  if (!token) return [];

  try {
    const { data } = await axios.get("/api/users", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data.users || [];
  } catch (error) {
    const err = error as AxiosError<ApiError>;
    throw err.response?.data || { message: "فشل جلب بيانات المستخدمين" };
  }
};

// ==========================================================
// 🔹 إنشاء مستخدم جديد
// ==========================================================
export const createUser = async (data: UserFormData): Promise<IUser> => {
  const token = localStorage.getItem("token");
  if (!token) throw { message: "يجب تسجيل الدخول أولاً" };

  try {
    const { data: response } = await axios.post<{ user: IUser }>("/api/users", data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.user;
  } catch (error) {
    const err = error as AxiosError<ApiError>;
    throw err.response?.data || { message: "فشل في إنشاء المستخدم" };
  }
};

// ==========================================================
// 🔹 تعديل بيانات مستخدم
// ==========================================================
export const updateUser = async (id: number, data: UserFormData): Promise<IUser> => {
  const token = localStorage.getItem("token");
  if (!token) throw { message: "يجب تسجيل الدخول أولاً" };

  try {
    const { data: response } = await axios.put<{ user: IUser }>(`/api/users/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.user;
  } catch (error) {
    const err = error as AxiosError<ApiError>;
    throw err.response?.data || { message: "فشل في تحديث المستخدم" };
  }
};

// ==========================================================
// 🔹 حذف مستخدم
// ==========================================================
export const deleteUser = async (id: number): Promise<void> => {
  const token = localStorage.getItem("token");
  if (!token) throw { message: "يجب تسجيل الدخول أولاً" };

  try {
    await axios.delete(`/api/users/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    const err = error as AxiosError<ApiError>;
    throw err.response?.data || { message: "فشل في حذف المستخدم" };
  }
};
