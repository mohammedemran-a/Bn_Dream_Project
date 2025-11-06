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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import permissionsTranslations from "@/lang/permissions.json";
import { useAuthStore } from "@/store/useAuthStore";
import { useRolesStore } from "@/store/useRolesStore";

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

const AdminRoles = () => {
  const {
    roles,
    availablePermissions,
    fetchRolesAndPermissions,
    addRole,
    editRole,
    removeRole,
    loading,
  } = useRolesStore();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [roleName, setRoleName] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const { toast } = useToast();
  const hasPermission = useAuthStore((state) => state.hasPermission);

  useEffect(() => {
    fetchRolesAndPermissions();
  }, [fetchRolesAndPermissions]);

  const handleOpenDialog = (role?: Role) => {
    if (!hasPermission(role ? "roles_edit" : "roles_create")) return;

    if (role) {
      setEditingRole(role);
      setRoleName(role.name);
      setSelectedPermissions(role.permissions);
    } else {
      setEditingRole(null);
      setRoleName("");
      setSelectedPermissions([]);
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingRole(null);
    setRoleName("");
    setSelectedPermissions([]);
  };

  const handlePermissionToggle = (permissionId: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(permissionId)
        ? prev.filter((p) => p !== permissionId)
        : [...prev, permissionId]
    );
  };

  const handleSaveRole = async () => {
    if (!hasPermission(editingRole ? "roles_edit" : "roles_create")) return;

    if (!roleName.trim()) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال اسم الدور",
        variant: "destructive",
      });
      return;
    }

    if (selectedPermissions.length === 0) {
      toast({
        title: "خطأ",
        description: "يرجى اختيار صلاحية واحدة على الأقل",
        variant: "destructive",
      });
      return;
    }

    try {
      if (editingRole) {
        await editRole(editingRole.id, {
          name: roleName,
          permissions: selectedPermissions,
        });
        toast({ title: "تم التحديث", description: "تم تعديل الدور بنجاح ✅" });
      } else {
        await addRole({
          name: roleName,
          permissions: selectedPermissions,
        });
        toast({ title: "تم الإنشاء", description: "تم إنشاء الدور بنجاح ✅" });
      }

      handleCloseDialog();
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      toast({
        title: "خطأ",
        description: err.response?.data?.message || "حدث خطأ أثناء الحفظ",
        variant: "destructive",
      });
    }
  };

  const handleDeleteRole = async (id: number) => {
    if (!hasPermission("roles_delete")) return;

    try {
      await removeRole(id);
      toast({ title: "تم الحذف", description: "تم حذف الدور بنجاح ✅" });
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      toast({
        title: "خطأ",
        description: err.response?.data?.message || "فشل الحذف",
        variant: "destructive",
      });
    }
  };

  if (!hasPermission("roles_view")) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-xl text-red-500 font-semibold">
            🚫 ليس لديك صلاحية عرض الأدوار
          </p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">إدارة الأدوار والصلاحيات</h1>
            <p className="text-muted-foreground">
              تخصيص الأدوار وتعيين الصلاحيات للمستخدمين
            </p>
          </div>

          {(hasPermission("roles_create") || hasPermission("roles_edit")) && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                {hasPermission("roles_create") && (
                  <Button
                    onClick={() => handleOpenDialog()}
                    className="gap-2 shadow-elegant"
                  >
                    <Plus className="w-4 h-4" />
                    إضافة دور جديد
                  </Button>
                )}
              </DialogTrigger>

              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingRole ? "تعديل الدور" : "إضافة دور جديد"}
                  </DialogTitle>
                  <DialogDescription>
                    قم بتحديد اسم الدور والصلاحيات المرتبطة به
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="role-name">اسم الدور</Label>
                    <Input
                      id="role-name"
                      placeholder="مثال: مدير الحجوزات"
                      value={roleName}
                      onChange={(e) => setRoleName(e.target.value)}
                    />
                  </div>

                  <div className="space-y-4">
                    <Label>الصلاحيات</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg bg-muted/30">
                      {availablePermissions.map((permission) => (
                        <div
                          key={permission.id}
                          className="flex items-center space-x-2 space-x-reverse"
                        >
                          <Checkbox
                            id={permission.id}
                            checked={selectedPermissions.includes(permission.id)}
                            onCheckedChange={() =>
                              handlePermissionToggle(permission.id)
                            }
                          />
                          <label
                            htmlFor={permission.id}
                            className="text-sm font-medium leading-none cursor-pointer"
                          >
                            {permissionsTranslations[permission.id] ||
                              permission.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={handleCloseDialog}>
                    إلغاء
                  </Button>
                  <Button onClick={handleSaveRole}>
                    {editingRole ? "حفظ التعديلات" : "إنشاء الدور"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>قائمة الأدوار</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>اسم الدور</TableHead>
                  <TableHead>عدد الصلاحيات</TableHead>
                  <TableHead>عدد المستخدمين</TableHead>
                  <TableHead>تاريخ الإنشاء</TableHead>
                  <TableHead className="text-right">العمليات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {roles.map((role) => (
                  <TableRow key={role.id} className="hover:bg-accent/5">
                    <TableCell className="font-medium">{role.name}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {role.permissions.length} صلاحية
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {role.usersCount} مستخدم
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {role.createdAt}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        {hasPermission("roles_edit") && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="hover:bg-primary/10"
                            onClick={() => handleOpenDialog(role)}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                        )}
                        {hasPermission("roles_delete") && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="hover:bg-destructive/10 hover:text-destructive"
                            onClick={() => handleDeleteRole(role.id)}
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
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminRoles;
