// src/pages/admin/AdminRoles.tsx
"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getRoles, getPermissions, createRole, updateRole, deleteRole, Role, PermissionItem } from "@/api/roles";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/store/useAuthStore";
import permissionsTranslations from "@/lang/permissions.json";

const handleApiError = (
  error: unknown,
  toast: (opts: { title: string; description: string; variant?: "default" | "destructive" }) => void
) => {
  const err = error as { response?: { data?: { message?: string } } };
  toast({
    title: "خطأ",
    description: err.response?.data?.message || "حدث خطأ أثناء العملية",
    variant: "destructive",
  });
};

const AdminRoles = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const hasPermission = useAuthStore((state) => state.hasPermission);

  const { data: roles = [], isLoading: loadingRoles } = useQuery<Role[], Error>({
    queryKey: ["roles"],
    queryFn: getRoles,
  });

  const { data: availablePermissions = [], isLoading: loadingPermissions } = useQuery<PermissionItem[], Error>({
    queryKey: ["permissions"],
    queryFn: async () => {
      const res = await getPermissions();
      return res.map((p) => (typeof p === "string" ? { id: p, label: p } : p));
    },
  });

  const createRoleMutation = useMutation({
    mutationFn: (data: { name: string; permissions: string[] }) => createRole(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      toast({ title: "تم الإنشاء", description: "تم إنشاء الدور بنجاح ✅" });
    },
    onError: (error: unknown) => handleApiError(error, toast),
  });

  const updateRoleMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: { name: string; permissions: string[] } }) =>
      updateRole(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      toast({ title: "تم التحديث", description: "تم تعديل الدور بنجاح ✅" });
    },
    onError: (error: unknown) => handleApiError(error, toast),
  });

  const deleteRoleMutation = useMutation({
    mutationFn: (id: number) => deleteRole(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      toast({ title: "تم الحذف", description: "تم حذف الدور بنجاح ✅" });
    },
    onError: (error: unknown) => handleApiError(error, toast),
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [roleName, setRoleName] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

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

  const handlePermissionToggle = (permissionId: string, checked: boolean) => {
    setSelectedPermissions((prev) =>
      checked ? [...prev, permissionId] : prev.filter((p) => p !== permissionId)
    );
  };

  const handleSaveRole = () => {
    if (!hasPermission(editingRole ? "roles_edit" : "roles_create")) return;

    if (!roleName.trim()) {
      toast({ title: "خطأ", description: "يرجى إدخال اسم الدور", variant: "destructive" });
      return;
    }

    if (selectedPermissions.length === 0) {
      toast({ title: "خطأ", description: "يرجى اختيار صلاحية واحدة على الأقل", variant: "destructive" });
      return;
    }

    if (editingRole) {
      updateRoleMutation.mutate({ id: editingRole.id, data: { name: roleName, permissions: selectedPermissions } });
    } else {
      createRoleMutation.mutate({ name: roleName, permissions: selectedPermissions });
    }

    handleCloseDialog();
  };

  const handleDeleteRole = (id: number) => {
    if (!hasPermission("roles_delete")) return;
    deleteRoleMutation.mutate(id);
  };

  if (!hasPermission("roles_view")) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-xl text-red-500 font-semibold">🚫 ليس لديك صلاحية عرض الأدوار</p>
        </div>
      </AdminLayout>
    );
  }

  if (loadingRoles || loadingPermissions) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-20">
          <p className="text-lg text-muted-foreground animate-pulse">جاري التحميل...</p>
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
            <p className="text-muted-foreground">تخصيص الأدوار وتعيين الصلاحيات للمستخدمين</p>
          </div>

          {(hasPermission("roles_create") || hasPermission("roles_edit")) && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                {hasPermission("roles_create") && (
                  <Button onClick={() => handleOpenDialog()} className="gap-2 shadow-elegant">
                    <Plus className="w-4 h-4" /> إضافة دور جديد
                  </Button>
                )}
              </DialogTrigger>

              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingRole ? "تعديل الدور" : "إضافة دور جديد"}</DialogTitle>
                  <DialogDescription>قم بتحديد اسم الدور والصلاحيات المرتبطة به</DialogDescription>
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
                        <div key={permission.id} className="flex items-center space-x-2 space-x-reverse">
                          <Checkbox
                            id={`perm-${permission.id}`}
                            checked={selectedPermissions.includes(permission.id)}
                            onCheckedChange={(checked) =>
                              handlePermissionToggle(permission.id, checked as boolean)
                            }
                          />
                          <label
                            htmlFor={`perm-${permission.id}`}
                            className="text-sm font-medium leading-none cursor-pointer"
                          >
                            {permissionsTranslations[permission.id] || permission.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={handleCloseDialog}>إلغاء</Button>
                  <Button onClick={handleSaveRole}>{editingRole ? "حفظ التعديلات" : "إنشاء الدور"}</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* ✅ جدول الأدوار بعد التنسيق */}
        <Card>
          <CardHeader>
            <CardTitle>قائمة الأدوار</CardTitle>
          </CardHeader>
          <CardContent>
            <div dir="rtl" className="overflow-x-auto">
              <Table className="min-w-full border-collapse text-center">
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-center w-[200px]">اسم الدور</TableHead>
                    <TableHead className="text-center w-[200px]">عدد الصلاحيات</TableHead>
                    <TableHead className="text-center w-[200px]">عدد المستخدمين</TableHead>
                    <TableHead className="text-center w-[200px]">تاريخ الإنشاء</TableHead>
                    <TableHead className="text-center w-[150px]">العمليات</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {roles.map((role) => (
                    <TableRow key={role.id} className="h-20 hover:bg-accent/5">
                      <TableCell className="align-middle whitespace-pre-wrap break-words max-w-[200px]">
                        {role.name}
                      </TableCell>
                      <TableCell className="align-middle whitespace-pre-wrap break-words max-w-[200px]">
                        <Badge variant="secondary">{role.permissions.length} صلاحية</Badge>
                      </TableCell>
                      <TableCell className="align-middle whitespace-pre-wrap break-words max-w-[200px]">
                        <Badge variant="outline">{role.usersCount || 0} مستخدم</Badge>
                      </TableCell>
                      <TableCell className="align-middle whitespace-pre-wrap break-words max-w-[200px] text-muted-foreground">
                        {role.createdAt}
                      </TableCell>
                      <TableCell className="align-middle">
                        <div className="flex gap-2 justify-center">
                          {hasPermission("roles_edit") && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleOpenDialog(role)}
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                          )}
                          {hasPermission("roles_delete") && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-destructive hover:bg-destructive/10"
                              onClick={() => handleDeleteRole(role.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}

                  {roles.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="py-6 text-center text-gray-500">
                        لا توجد أدوار حالياً
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminRoles;
