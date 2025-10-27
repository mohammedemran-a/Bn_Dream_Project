import { useState } from "react";
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

const usersData = [
  { 
    id: 1, 
    name: "أحمد محمد",
    phone: "0501234567",
    email: "ahmed@example.com",
    role: "عميل",
    status: "نشط",
    lastLogin: "2025-10-22 14:30"
  },
  { 
    id: 2, 
    name: "سارة علي",
    phone: "0507654321",
    email: "sara@example.com",
    role: "عميل",
    status: "نشط",
    lastLogin: "2025-10-21 10:15"
  },
  { 
    id: 3, 
    name: "محمد خالد",
    phone: "0509876543",
    email: "mohammed@example.com",
    role: "موظف",
    status: "نشط",
    lastLogin: "2025-10-22 09:00"
  },
];

const AdminUsers = () => {
  const [users, setUsers] = useState(usersData);

  return (
    <AdminLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">إدارة المستخدمين</h1>
            <p className="text-muted-foreground">إدارة حسابات العملاء والموظفين</p>
          </div>
          
          <Button className="gap-2 shadow-elegant">
            <Plus className="w-4 h-4" />
            إضافة مستخدم جديد
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>قائمة المستخدمين</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>الاسم</TableHead>
                  <TableHead>رقم الهاتف</TableHead>
                  <TableHead>البريد الإلكتروني</TableHead>
                  <TableHead>الصلاحية</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead>آخر تسجيل دخول</TableHead>
                  <TableHead className="text-right">العمليات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id} className="hover:bg-accent/5">
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell className="font-mono text-sm">{user.phone}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant={user.role === "موظف" ? "default" : "secondary"}>
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-success border-success">
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {user.lastLogin}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Button size="sm" variant="ghost" className="hover:bg-primary/10">
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="hover:bg-destructive/10 hover:text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
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

export default AdminUsers;
