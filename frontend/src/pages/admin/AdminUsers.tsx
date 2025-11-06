import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/store/useAuthStore";
import { useAdminUsersStore } from "@/store/useAdminUsersStore";

interface IUser {
  id: number;
  name: string;
  email: string;
  phone?: string;
  roles?: string[];
}

const AdminUsers = () => {
  const hasPermission = useAuthStore((state) => state.hasPermission);
  const { users, roles, loading, fetchUsersAndRoles, createUser, updateUser, deleteUser } =
    useAdminUsersStore();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<IUser | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "",
  });

  // 🟢 عند تحميل الصفحة
  useEffect(() => {
    if (hasPermission("users_view")) fetchUsersAndRoles();
  }, [fetchUsersAndRoles, hasPermission]);

  const resetForm = () => {
    setFormData({ name: "", email: "", phone: "", password: "", role: "" });
    setEditingUser(null);
  };

  const handleEdit = (user: IUser) => {
    if (!hasPermission("users_edit")) return toast.error("🚫 ليس لديك صلاحية التعديل!");
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      if (!hasPermission("users_edit")) return toast.error("🚫 ليس لديك صلاحية التعديل!");
      await updateUser(editingUser.id, formData);
    } else {
      if (!hasPermission("users_create")) return toast.error("🚫 ليس لديك صلاحية الإضافة!");
      await createUser(formData);
    }
    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = async (id: number) => {
    if (!hasPermission("users_delete")) return toast.error("🚫 ليس لديك صلاحية الحذف!");
    if (!confirm("هل أنت متأكد من حذف هذا المستخدم؟")) return;
    await deleteUser(id);
  };

  if (!hasPermission("users_view")) {
    return (
      <AdminLayout>
        <p className="text-center text-red-600 text-lg mt-10">🚫 ليس لديك صلاحية عرض المستخدمين</p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* رأس الصفحة + زر إضافة */}
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
                  <DialogTitle>{editingUser ? "تعديل المستخدم" : "إضافة مستخدم"}</DialogTitle>
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
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">البريد الإلكتروني</Label>
                    <Input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">رقم الهاتف</Label>
                    <Input
                      type="text"
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="password">كلمة المرور</Label>
                    <Input
                      type="password"
                      id="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder={editingUser ? "اتركها فارغة للإبقاء عليها" : ""}
                    />
                  </div>

                  <div>
                    <Label htmlFor="role">الدور</Label>
                    <Select
                      value={formData.role}
                      onValueChange={(value) => setFormData({ ...formData, role: value })}
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
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      إلغاء
                    </Button>
                    <Button type="submit">{editingUser ? "تحديث" : "حفظ"}</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* جدول المستخدمين */}
        <Card>
          <CardHeader>
            <CardTitle>قائمة المستخدمين</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>جارٍ التحميل...</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>الاسم</TableHead>
                    <TableHead>البريد الإلكتروني</TableHead>
                    <TableHead>الهاتف</TableHead>
                    <TableHead>الدور</TableHead>
                    <TableHead>العمليات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.phone || "-"}</TableCell>
                      <TableCell>
                        {user.roles?.map((r) => (
                          <Badge key={r}>{r}</Badge>
                        ))}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2 justify-end">
                          {hasPermission("users_edit") && (
                            <Button size="sm" variant="ghost" onClick={() => handleEdit(user)}>
                              <Pencil className="w-4 h-4" />
                            </Button>
                          )}
                          {hasPermission("users_delete") && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-destructive"
                              onClick={() => handleDelete(user.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;
