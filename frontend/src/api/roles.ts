// src/api/roles.ts
import instance from "./axios"; // 🔥 استدعاء Axios instance بدل axios

export interface Role {
  id: number;
  name: string;
  permissions: string[];
  usersCount?: number;
  createdAt?: string;
}

export interface PermissionItem {
  id: string;
  label: string;
}

// ================================
// 🔹 جلب كل الأدوار
// ================================
export const getRoles = async (): Promise<Role[]> => {
  const { data } = await instance.get("/api/roles");
  return data;
};

// ================================
// 🔹 جلب جميع الصلاحيات
// ================================
export const getPermissions = async (): Promise<PermissionItem[]> => {
  const { data } = await instance.get("/api/permissions");
  return data;
};

// ================================
// 🔹 إنشاء دور جديد
// ================================
export const createRole = async (role: { name: string; permissions: string[] }): Promise<Role> => {
  const { data } = await instance.post("/api/roles", role);
  return data;
};

// ================================
// 🔹 تحديث دور
// ================================
export const updateRole = async (id: number, role: { name: string; permissions: string[] }): Promise<Role> => {
  const { data } = await instance.put(`/api/roles/${id}`, role);
  return data;
};

// ================================
// 🔹 حذف دور
// ================================
export const deleteRole = async (id: number): Promise<void> => {
  await instance.delete(`/api/roles/${id}`);
};
