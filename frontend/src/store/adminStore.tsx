import { create } from "zustand";
import { getAllUsers, createUser, updateUser, deleteUser } from "@/api/auth";
import { getRoles, getPermissions, createRole, updateRole, deleteRole } from "@/api/role";

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
  permissions: string[];
  usersCount?: number;
  createdAt?: string;
}

interface AdminState {
  users: IUser[];
  roles: IRole[];
  availablePermissions: string[];
  loadingUsers: boolean;
  loadingRoles: boolean;

  fetchUsers: () => Promise<void>;
  fetchRoles: () => Promise<void>;

  createUser: (data: Partial<IUser>) => Promise<void>;
  updateUser: (id: number, data: Partial<IUser>) => Promise<void>;
  deleteUser: (id: number) => Promise<void>;

  createRole: (data: Partial<IRole>) => Promise<void>;
  updateRole: (id: number, data: Partial<IRole>) => Promise<void>;
  deleteRole: (id: number) => Promise<void>;
}

export const useAdminStore = create<AdminState>((set, get) => ({
  users: [],
  roles: [],
  availablePermissions: [],
  loadingUsers: false,
  loadingRoles: false,

  fetchUsers: async () => {
    try {
      set({ loadingUsers: true });
      const res = await getAllUsers();
      set({ users: res.users || [] });
    } finally {
      set({ loadingUsers: false });
    }
  },

  fetchRoles: async () => {
    try {
      set({ loadingRoles: true });
      const [rolesRes, permissionsRes] = await Promise.all([getRoles(), getPermissions()]);
      set({ roles: rolesRes || [], availablePermissions: permissionsRes || [] });
    } finally {
      set({ loadingRoles: false });
    }
  },

  createUser: async (data) => {
    const res = await createUser(data);
    set({ users: [...get().users, res.user] });
  },

  updateUser: async (id, data) => {
    const res = await updateUser(id, data);
    set({ users: get().users.map(u => u.id === id ? res.user : u) });
  },

  deleteUser: async (id) => {
    await deleteUser(id);
    set({ users: get().users.filter(u => u.id !== id) });
  },

  createRole: async (data) => {
    await createRole(data);
    const updatedRoles = await getRoles();
    set({ roles: updatedRoles });
  },

  updateRole: async (id, data) => {
    await updateRole(id, data);
    const updatedRoles = await getRoles();
    set({ roles: updatedRoles });
  },

  deleteRole: async (id) => {
    await deleteRole(id);
    const updatedRoles = await getRoles();
    set({ roles: updatedRoles });
  }
}));
