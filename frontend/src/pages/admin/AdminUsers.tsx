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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "user",
  });

  // 🧩 جلب المستخدمين من السيرفر
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("يجب تسجيل الدخول للوصول إلى هذه الصفحة");
          setUsers([]);
          return;
        }

        const data = await getAllUsers();
        const usersList = data.users || data || [];
        setUsers(usersList);
      } catch (error) {
        console.error(error);
        toast.error(error.message || "فشل جلب المستخدمين");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // 🧩 إضافة أو تعديل مستخدم
  const handleAddOrEditUser = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        // تعديل
        const response = await updateUser(editingUser.id, formData);
        setUsers((prev) =>
          prev.map((u) => (u.id === editingUser.id ? response.user : u))
        );
        toast.success("تم تعديل المستخدم ✅");
      } else {
        // إضافة
        const response = await createUser(formData);
        setUsers((prev) => [...prev, response.user]);
        toast.success("تمت إضافة المستخدم ✅");
      }

      // إعادة تهيئة الفورم
      setFormData({
        name: "",
        email: "",
        phone: "",
        password: "",
        role: "user",
      });
      setEditingUser(null);
      setOpen(false);
    } catch (error) {
      console.error(error);
      toast.error(error.message || "فشل العملية ❌");
    }
  };

  // 🧩 حذف مستخدم
  const handleDeleteUser = async (id) => {
    if (!confirm("هل أنت متأكد من حذف هذا المستخدم؟")) return;
    try {
      await deleteUser(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
      toast.success("تم حذف المستخدم ✅");
    } catch (error) {
      console.error(error);
      toast.error(error.message || "فشل حذف المستخدم ❌");
    }
  };

  // 🧩 فتح الفورم للتعديل
  const handleEditClick = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone || "",
      password: "",
      role: user.roles?.[0] || "user",
    });
    setOpen(true);
  };

  return (
    <AdminLayout>
      <div className="space-y-6 animate-fade-in">
        {/* 🧭 العنوان */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">إدارة المستخدمين</h1>
            <p className="text-muted-foreground">إدارة حسابات العملاء والموظفين</p>
          </div>

          {/* 🔘 زر الإضافة داخل Dialog */}
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 shadow-elegant">
                <Plus className="w-4 h-4" />
                {editingUser ? "تعديل المستخدم" : "إضافة مستخدم جديد"}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>{editingUser ? "تعديل المستخدم" : "إضافة مستخدم جديد"}</DialogTitle>
                <DialogDescription>
                  يمكنك إدخال بيانات المستخدم هنا وتعيين دوره.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleAddOrEditUser} className="space-y-4 mt-4">
                <div>
                  <Label>الاسم</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="أدخل اسم المستخدم"
                    required
                  />
                </div>

                <div>
                  <Label>البريد الإلكتروني</Label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="example@email.com"
                    required
                  />
                </div>

                <div>
                  <Label>رقم الهاتف</Label>
                  <Input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="مثلاً: 777777777"
                  />
                </div>

                <div>
                  <Label>كلمة المرور</Label>
                  <Input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder={editingUser ? "•••••••• (اتركه كما هو إذا لم ترغب بالتغيير)" : "••••••••"}
                    required={!editingUser}
                  />
                </div>

                <div>
                  <Label>الدور (Role)</Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value) => setFormData({ ...formData, role: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الدور" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">مستخدم</SelectItem>
                      <SelectItem value="admin">مشرف</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <DialogFooter className="flex justify-end mt-4 gap-2">
                  <Button type="button" variant="outline" onClick={() => { setOpen(false); setEditingUser(null); }}>
                    إلغاء
                  </Button>
                  <Button type="submit">{editingUser ? "تحديث المستخدم" : "حفظ المستخدم"}</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* 📋 جدول المستخدمين */}
        <Card>
          <CardHeader>
            <CardTitle>قائمة المستخدمين</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
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
                    <TableHead>الصلاحية</TableHead>
                    <TableHead className="text-right">العمليات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id} className="hover:bg-accent/5">
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell className="font-mono text-sm">{user.phone || "-"}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant={user.roles?.includes("admin") ? "default" : "secondary"}>
                          {user.roles?.join(", ") || "مستخدم"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button size="sm" variant="ghost" className="hover:bg-primary/10"
                            onClick={() => handleEditClick(user)}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost" className="hover:bg-destructive/10 hover:text-destructive"
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
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
