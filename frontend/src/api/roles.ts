// src/api/roles.ts
import axios from "./axios";

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

// جلب كل الأدوار
export const getRoles = async (): Promise<Role[]> => {
  const { data } = await axios.get("/api/roles");
  return data;
};

// جلب كل الصلاحيات
export const getPermissions = async (): Promise<PermissionItem[]> => {
  const { data } = await axios.get("/api/permissions");
  return data;
};

// إنشاء دور جديد
export const createRole = async (role: { name: string; permissions: string[] }): Promise<Role> => {
  const { data } = await axios.post("/api/roles", role);
  return data;
};

// تعديل دور
export const updateRole = async (id: number, role: { name: string; permissions: string[] }): Promise<Role> => {
  const { data } = await axios.put(`/api/roles/${id}`, role);
  return data;
};

// حذف دور
export const deleteRole = async (id: number): Promise<void> => {
  await axios.delete(`/api/roles/${id}`);
};
