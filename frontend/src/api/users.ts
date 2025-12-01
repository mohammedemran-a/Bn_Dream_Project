import instance, { AxiosError } from "./axios"; // ← تصحيح مهم

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

interface ApiError {
  message: string;
  [key: string]: unknown;
}

// ==========================================================
// 🔹 جلب جميع المستخدمين
// ==========================================================
export const getAllUsers = async (): Promise<IUser[]> => {
  try {
    const { data } = await instance.get("/api/users"); // ← بدون headers
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
  try {
    const { data: response } = await instance.post<{ user: IUser }>("/api/users", data);
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
  try {
    const { data: response } = await instance.put<{ user: IUser }>(`/api/users/${id}`, data);
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
  try {
    await instance.delete(`/api/users/${id}`);
  } catch (error) {
    const err = error as AxiosError<ApiError>;
    throw err.response?.data || { message: "فشل في حذف المستخدم" };
  }
};
