import { create } from "zustand";
import { getAllUsers, createUser, updateUser, deleteUser } from "@/api/auth";
import { getRoles } from "@/api/role";
import { toast } from "sonner";
import { AxiosError } from "axios";

interface IUser {
  id: number;
  name: string;
  email: string;
  phone?: string;
  roles?: string[];
}

interface IRole {
  id: number;
  name: string;
}

interface UserFormData {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: string;
}

interface AdminUsersState {
  users: IUser[];
  roles: IRole[];
  loading: boolean;
  fetchUsersAndRoles: () => Promise<void>;
  createUser: (data: UserFormData) => Promise<void>;
  updateUser: (id: number, data: UserFormData) => Promise<void>;
  deleteUser: (id: number) => Promise<void>;
}

export const useAdminUsersStore = create<AdminUsersState>((set) => ({
  users: [],
  roles: [],
  loading: false,

  // 🟢 جلب المستخدمين والأدوار
  fetchUsersAndRoles: async () => {
    try {
      set({ loading: true });
      const [usersRes, rolesRes] = await Promise.all([getAllUsers(), getRoles()]);
      set({
        users: usersRes.users || [],
        roles: rolesRes || [],
      });
    } catch (error: unknown) {
      const err = error as AxiosError<{ message?: string }>;
      toast.error(err.response?.data?.message || "فشل تحميل المستخدمين ❌");
    } finally {
      set({ loading: false });
    }
  },

  // 🟢 إنشاء مستخدم جديد
  createUser: async (data) => {
    try {
      const response = await createUser(data);
      set((state) => ({
        users: [...state.users, response.user],
      }));
      toast.success("تمت إضافة المستخدم ✅");
    } catch (error: unknown) {
      const err = error as AxiosError<{ message?: string }>;
      toast.error(err.response?.data?.message || "فشل في إنشاء المستخدم ❌");
    }
  },

  // 🟢 تعديل مستخدم
  updateUser: async (id, data) => {
    try {
      const response = await updateUser(id, data);
      set((state) => ({
        users: state.users.map((u) => (u.id === id ? response.user : u)),
      }));
      toast.success("تم تعديل المستخدم ✅");
    } catch (error: unknown) {
      const err = error as AxiosError<{ message?: string }>;
      toast.error(err.response?.data?.message || "فشل تعديل المستخدم ❌");
    }
  },

  // 🟢 حذف مستخدم
  deleteUser: async (id) => {
    try {
      await deleteUser(id);
      set((state) => ({
        users: state.users.filter((u) => u.id !== id),
      }));
      toast.success("تم حذف المستخدم ✅");
    } catch (error: unknown) {
      const err = error as AxiosError<{ message?: string }>;
      toast.error(err.response?.data?.message || "فشل حذف المستخدم ❌");
    }
  },
}));
