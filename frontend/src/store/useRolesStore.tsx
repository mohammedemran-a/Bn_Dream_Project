import { create } from "zustand";
import {
  getRoles,
  getPermissions,
  createRole,
  updateRole,
  deleteRole,
} from "@/api/role";

interface Role {
  id: number;
  name: string;
  permissions: string[];
  usersCount: number;
  createdAt: string;
}

interface PermissionItem {
  id: string;
  label: string;
}

interface RolesState {
  roles: Role[];
  availablePermissions: PermissionItem[];
  loading: boolean;
  fetchRolesAndPermissions: () => Promise<void>;
  addRole: (data: { name: string; permissions: string[] }) => Promise<void>;
  editRole: (id: number, data: { name: string; permissions: string[] }) => Promise<void>;
  removeRole: (id: number) => Promise<void>;
}

export const useRolesStore = create<RolesState>((set) => ({
  roles: [],
  availablePermissions: [],
  loading: false,

  fetchRolesAndPermissions: async () => {
    try {
      set({ loading: true });
      const [rolesRes, permissionsRes] = await Promise.all([
        getRoles(),
        getPermissions(),
      ]);

      set({
        roles: rolesRes,
        availablePermissions: permissionsRes.map((p: string) => ({
          id: p,
          label: p,
        })),
      });
    } catch (error) {
      console.error("فشل تحميل الأدوار أو الصلاحيات", error);
    } finally {
      set({ loading: false });
    }
  },

  addRole: async (data) => {
    await createRole(data);
    const updatedRoles = await getRoles();
    set({ roles: updatedRoles });
  },

  editRole: async (id, data) => {
    await updateRole(id, data);
    const updatedRoles = await getRoles();
    set({ roles: updatedRoles });
  },

  removeRole: async (id) => {
    await deleteRole(id);
    const updatedRoles = await getRoles();
    set({ roles: updatedRoles });
  },
}));
