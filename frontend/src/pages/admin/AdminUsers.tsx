// src/pages/admin/AdminUsers.tsx
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/store/useAuthStore";
import {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  IUser,
  UserFormData,
} from "@/api/users.ts";
import { getRoles, Role } from "@/api/roles";
import { AxiosError } from "axios";

const AdminUsers = () => {
  const queryClient = useQueryClient();
  const hasPermission = useAuthStore((state) => state.hasPermission);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<IUser | null>(null);
  const [formData, setFormData] = useState<UserFormData>({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "",
  });

  // ===============================
  // React Query - Fetch Users & Roles
  // ===============================
  const {
    data: usersData,
    isLoading: loadingUsers,
    error: usersError,
  } = useQuery<IUser[], Error>({
    queryKey: ["users"],
    queryFn: getAllUsers,
    enabled: hasPermission("users_view"),
  });

  const users: IUser[] = Array.isArray(usersData) ? usersData : [];

  const {
    data: rolesData,
    isLoading: loadingRoles,
    error: rolesError,
  } = useQuery<Role[], Error>({
    queryKey: ["roles"],
    queryFn: getRoles,
    enabled: hasPermission("users_view"),
  });

  const roles: Role[] = Array.isArray(rolesData) ? rolesData : [];

  if (usersError) toast.error(usersError.message || "فشل جلب المستخدمين");
  if (rolesError) toast.error(rolesError.message || "فشل جلب الأدوار");

  // ===============================
  // Mutations
  // ===============================
  const handleMutationError = (err: unknown, defaultMsg: string) => {
    if (err instanceof AxiosError) {
      toast.error(err.response?.data?.message || defaultMsg);
    } else if (err instanceof Error) {
      toast.error(err.message || defaultMsg);
    } else {
      toast.error(defaultMsg);
    }
  };

  const createMutation = useMutation({
    mutationFn: (data: UserFormData) => createUser(data),
    onSuccess: () => {
      toast.success("تمت إضافة المستخدم ✅");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (err: unknown) =>
      handleMutationError(err, "فشل في إنشاء المستخدم ❌"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UserFormData }) =>
      updateUser(id, data),
    onSuccess: () => {
      toast.success("تم تعديل المستخدم ✅");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (err: unknown) => handleMutationError(err, "فشل تعديل المستخدم ❌"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteUser(id),
    onSuccess: () => {
      toast.success("تم حذف المستخدم ✅");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (err: unknown) => handleMutationError(err, "فشل حذف المستخدم ❌"),
  });

  // ===============================
  // Form Handlers
  // ===============================
  const resetForm = () => {
    setFormData({ name: "", email: "", phone: "", password: "", role: "" });
    setEditingUser(null);
  };

  const handleEdit = (user: IUser) => {
    if (!hasPermission("users_edit"))
      return toast.error("🚫 ليس لديك صلاحية التعديل!");
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone || "",
      password: "",
      role: user.roles?.[0] || "",
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      if (!hasPermission("users_edit"))
        return toast.error("🚫 ليس لديك صلاحية التعديل!");
      updateMutation.mutate({ id: editingUser.id, data: formData });
    } else {
      if (!hasPermission("users_create"))
        return toast.error("🚫 ليس لديك صلاحية الإضافة!");
      createMutation.mutate(formData);
    }
    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = (id: number) => {
    if (!hasPermission("users_delete"))
      return toast.error("🚫 ليس لديك صلاحية الحذف!");
    if (!confirm("هل أنت متأكد من حذف هذا المستخدم؟")) return;
    deleteMutation.mutate(id);
  };

  // ===============================
  // Permissions check
  // ===============================
  if (!hasPermission("users_view")) {
    return (
      <AdminLayout>
        <p className="text-center text-red-600 text-lg mt-10">
          🚫 ليس لديك صلاحية عرض المستخدمين
        </p>
      </AdminLayout>
    );
  }

  // ===============================
  // Render
  // ===============================
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header + Add Button */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">إدارة المستخدمين</h1>
          {(hasPermission("users_create") || hasPermission("users_edit")) && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                {hasPermission("users_create") && (
                  <Button
                    className="gap-2"
                    onClick={() => {
                      resetForm();
                      setEditingUser(null);
                    }}
                  >
                    <Plus className="w-4 h-4" />
                    إضافة مستخدم جديد
                  </Button>
                )}
              </DialogTrigger>

              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>
                    {editingUser ? "تعديل المستخدم" : "إضافة مستخدم"}
                  </DialogTitle>
                  <DialogDescription>
                    {editingUser
                      ? "قم بتعديل بيانات المستخدم ثم اضغط تحديث"
                      : "أدخل بيانات المستخدم الجديدة ثم اضغط حفظ"}
                  </DialogDescription>
                </DialogHeader>

                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div>
                    <Label htmlFor="name">الاسم</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">البريد الإلكتروني</Label>
                    <Input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">رقم الهاتف</Label>
                    <Input
                      type="text"
                      id="phone"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="password">كلمة المرور</Label>
                    <Input
                      type="password"
                      id="password"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      placeholder={editingUser ? "اتركها فارغة للإبقاء عليها" : ""}
                    />
                  </div>

                  <div>
                    <Label htmlFor="role">الدور</Label>
                    <Select
                      value={formData.role}
                      onValueChange={(value) =>
                        setFormData({ ...formData, role: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="اختر الدور" />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map((role) => (
                          <SelectItem key={role.id} value={role.name}>
                            {role.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                    >
                      إلغاء
                    </Button>
                    <Button type="submit">
                      {editingUser ? "تحديث" : "حفظ"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>قائمة المستخدمين</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingUsers ? (
              <p>جارٍ التحميل...</p>
            ) : (
              <div dir="rtl" className="overflow-x-auto">
                <Table className="min-w-full border-collapse text-center">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-center w-[200px]">
                        الاسم
                      </TableHead>
                      <TableHead className="text-center w-[250px]">
                        البريد الإلكتروني
                      </TableHead>
                      <TableHead className="text-center w-[150px]">
                        الهاتف
                      </TableHead>
                      <TableHead className="text-center w-[150px]">
                        الدور
                      </TableHead>
                      <TableHead className="text-center w-[150px]">
                        العمليات
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow
                        key={user.id}
                        className="h-20 hover:bg-accent/5"
                      >
                        <TableCell className="align-middle whitespace-pre-wrap break-words max-w-[200px]">
                          {user.name}
                        </TableCell>
                        <TableCell className="align-middle whitespace-pre-wrap break-words max-w-[250px]">
                          {user.email}
                        </TableCell>
                        <TableCell className="align-middle whitespace-pre-wrap break-words max-w-[150px]">
                          {user.phone || "-"}
                        </TableCell>
                        <TableCell className="align-middle whitespace-pre-wrap break-words max-w-[150px]">
                          {user.roles?.map((r) => (
                            <Badge key={r}>{r}</Badge>
                          ))}
                        </TableCell>
                        <TableCell className="align-middle">
                          <div className="flex gap-2 justify-center">
                            {hasPermission("users_edit") && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleEdit(user)}
                              >
                                <Pencil className="w-4 h-4" />
                              </Button>
                            )}
                            {hasPermission("users_delete") && (
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-destructive hover:bg-destructive/10"
                                onClick={() => handleDelete(user.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}

                    {users.length === 0 && (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="py-6 text-center text-gray-500"
                        >
                          لا توجد مستخدمين حالياً
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;
