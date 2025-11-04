import { useState, useEffect } from "react";
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
import { Pencil, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";
import { getAllUsers, createUser, updateUser, deleteUser } from "@/api/auth";
import { getRoles } from "@/api/role";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
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
import { useAuth } from "@/context/AuthContext";

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

const AdminUsers = () => {
  const { hasPermission } = useAuth();

  const [users, setUsers] = useState<IUser[]>([]);
  const [roles, setRoles] = useState<IRole[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<IUser | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "",
  });

  // 🧩 جلب المستخدمين والأدوار
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingUsers(true);
        const [usersRes, rolesRes] = await Promise.all([getAllUsers(), getRoles()]);
        setUsers(usersRes.users || []);
        setRoles(rolesRes || []);
      } catch (error: unknown) {
        console.error(error);
        const message =
          error instanceof Error
            ? error.message
            : "حدث خطأ أثناء تحميل البيانات";
        toast.error(message);
      } finally {
        setLoadingUsers(false);
      }
    };
    fetchData();
  }, []);

  // 🧩 إضافة أو تعديل مستخدم
  const handleAddOrEditUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingUser) {
        const response = await updateUser(editingUser.id, formData);
        setUsers((prev) =>
          prev.map((u) => (u.id === editingUser.id ? response.user : u))
        );
        toast.success("تم تعديل المستخدم ✅");
      } else {
        const response = await createUser(formData);
        setUsers((prev) => [...prev, response.user]);
        toast.success("تمت إضافة المستخدم ✅");
      }

      setFormData({ name: "", email: "", phone: "", password: "", role: "" });
      setEditingUser(null);
      setOpen(false);
    } catch (error: unknown) {
      console.error(error);
      const message =
        error instanceof Error
          ? error.message
          : "فشل العملية ❌";
      toast.error(message);
    }
  };

  // 🗑️ حذف مستخدم
  const handleDeleteUser = async (id: number) => {
    if (!confirm("هل أنت متأكد من حذف هذا المستخدم؟")) return;
    try {
      await deleteUser(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
      toast.success("تم حذف المستخدم ✅");
    } catch (error: unknown) {
      console.error(error);
      const message =
        error instanceof Error
          ? error.message
          : "فشل حذف المستخدم ❌";
      toast.error(message);
    }
  };

  // ✏️ تعديل مستخدم
  const handleEditClick = (user: IUser) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone || "",
      password: "",
      role: user.roles?.[0] || "",
    });
    setOpen(true);
  };

  // 🧩 التحقق من صلاحية العرض
  if (!hasPermission("users_view")) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-xl text-red-500 font-semibold">
            🚫 ليس لديك صلاحية عرض المستخدمين
          </p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6 animate-fade-in">
        {/* العنوان + زر الإضافة */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">إدارة المستخدمين</h1>
            <p className="text-muted-foreground">
              إدارة حسابات المستخدمين والأدوار
            </p>
          </div>

          {/* ✅ عرض الـ Dialog إذا كان لديه صلاحية إنشاء أو تعديل */}
          {(hasPermission("users_create") || hasPermission("users_edit")) && (
            <Dialog open={open} onOpenChange={setOpen}>
              {/* الزر الأساسي (إضافة) */}
              {hasPermission("users_create") && (
                <DialogTrigger asChild>
                  <Button className="gap-2 shadow-elegant">
                    <Plus className="w-4 h-4" />
                    {editingUser ? "تعديل المستخدم" : "إضافة مستخدم جديد"}
                  </Button>
                </DialogTrigger>
              )}

              {/* محتوى الـ Dialog */}
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>
                    {editingUser ? "تعديل المستخدم" : "إضافة مستخدم جديد"}
                  </DialogTitle>
                  <DialogDescription>
                    يمكنك إدخال بيانات المستخدم هنا وتعيين دوره.
                  </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleAddOrEditUser} className="space-y-4 mt-4">
                  <div>
                    <Label>الاسم</Label>
                    <Input
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="أدخل اسم المستخدم"
                      required
                    />
                  </div>

                  <div>
                    <Label>البريد الإلكتروني</Label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      placeholder="example@email.com"
                      required
                    />
                  </div>

                  <div>
                    <Label>رقم الهاتف</Label>
                    <Input
                      type="text"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      placeholder="مثلاً: 777777777"
                    />
                  </div>

                  <div>
                    <Label>كلمة المرور</Label>
                    <Input
                      type="password"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      placeholder={
                        editingUser
                          ? "•••••••• (اتركه فارغًا إن لم ترغب بتغييره)"
                          : "••••••••"
                      }
                      required={!editingUser}
                    />
                  </div>

                  <div>
                    <Label>الدور (Role)</Label>
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

                  <DialogFooter className="flex justify-end mt-4 gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setOpen(false);
                        setEditingUser(null);
                      }}
                    >
                      إلغاء
                    </Button>
                    <Button type="submit">
                      {editingUser ? "تحديث المستخدم" : "حفظ المستخدم"}
                    </Button>
                  </DialogFooter>
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
            {loadingUsers ? (
              <p className="text-center py-4">جاري تحميل المستخدمين...</p>
            ) : users.length === 0 ? (
              <p className="text-center py-4">لا يوجد مستخدمون</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>الاسم</TableHead>
                    <TableHead>رقم الهاتف</TableHead>
                    <TableHead>البريد الإلكتروني</TableHead>
                    <TableHead>الدور</TableHead>
                    <TableHead className="text-right">العمليات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id} className="hover:bg-accent/5">
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell className="font-mono text-sm">
                        {user.phone || "-"}
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            user.roles?.includes("admin")
                              ? "default"
                              : "secondary"
                          }
                        >
                          {user.roles?.join(", ") || "—"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right flex gap-2 justify-end">
                        {hasPermission("users_edit") && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="hover:bg-primary/10"
                            onClick={() => handleEditClick(user)}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                        )}
                        {hasPermission("users_delete") && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="hover:bg-destructive/10 hover:text-destructive"
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
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
