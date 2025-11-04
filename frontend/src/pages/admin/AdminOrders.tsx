import { useEffect, useState } from "react";
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
import { Check, Truck, X, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { getAllOrders, updateOrderStatus, deleteOrder } from "@/api/orders";
import { useAuth } from "@/context/AuthContext";

interface Order {
  id: number;
  user: { name: string; phone?: string } | null;
  total: number;
  status: string;
  created_at: string;
  products: {
    id: number;
    name: string;
    pivot: { quantity: number; price: number };
  }[];
}

const AdminOrders = () => {
  const { hasPermission } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await getAllOrders();
      setOrders(data);
    } catch (error) {
      console.error(error);
      toast.error("حدث خطأ أثناء جلب الطلبات");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: number, newStatus: string) => {
    if (!hasPermission("orders_process")) {
      toast.error("🚫 ليس لديك صلاحية لمعالجة الطلبات");
      return;
    }

    try {
      await updateOrderStatus(id, newStatus);
      toast.success("تم تحديث حالة الطلب ✅");
      fetchOrders();
    } catch (error) {
      console.error(error);
      toast.error("فشل تحديث حالة الطلب ❌");
    }
  };

  const handleDelete = async (id: number) => {
    if (!hasPermission("orders_delete")) {
      toast.error("🚫 ليس لديك صلاحية لحذف الطلبات");
      return;
    }

    if (!confirm("هل أنت متأكد أنك تريد حذف هذا الطلب نهائيًا؟")) return;
    try {
      await deleteOrder(id);
      toast.success("تم حذف الطلب بنجاح ✅");
      fetchOrders();
    } catch (error) {
      console.error(error);
      toast.error("فشل حذف الطلب ❌");
    }
  };

  useEffect(() => {
    if (hasPermission("orders_view")) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [hasPermission]);

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "جديد":
        return "secondary";
      case "قيد التنفيذ":
        return "default";
      case "تم التسليم":
        return "outline";
      case "ملغي":
        return "destructive";
      default:
        return "outline";
    }
  };

  // 🚫 في حال عدم وجود صلاحية عرض الطلبات
  if (!hasPermission("orders_view")) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-xl text-red-500 font-semibold">
            🚫 ليس لديك صلاحية عرض الطلبات
          </p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6 animate-fade-in" dir="rtl">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-right">الطلبات الواردة</h1>
          <p className="text-muted-foreground text-right">
            عرض طلبات المستخدمين وإدارتها
          </p>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>قائمة الطلبات</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchOrders}
              disabled={loading}
            >
              🔄 تحديث
            </Button>
          </CardHeader>

          <CardContent>
            {loading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : orders.length === 0 ? (
              <p className="text-center text-muted-foreground py-6">
                لا توجد طلبات حالياً
              </p>
            ) : (
              <div className="overflow-x-auto">
                <Table className="table-fixed w-full border-collapse text-center">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[120px] text-center">المستخدم</TableHead>
                      <TableHead className="w-[130px] text-center">رقم الهاتف</TableHead>
                      <TableHead className="w-[250px] text-center">المنتجات</TableHead>
                      <TableHead className="w-[180px] text-center">التاريخ</TableHead>
                      <TableHead className="w-[100px] text-center">المبلغ</TableHead>
                      <TableHead className="w-[100px] text-center">الحالة</TableHead>
                      <TableHead className="w-[150px] text-center">العمليات</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id} className="hover:bg-accent/5">
                        <TableCell className="font-medium text-center">
                          {order.user?.name ?? "—"}
                        </TableCell>
                        <TableCell className="font-mono text-sm text-center">
                          {order.user?.phone ?? "—"}
                        </TableCell>
                        <TableCell className="max-w-[250px] truncate text-center">
                          {order.products.length > 0
                            ? order.products
                                .map((p) => `${p.name} × ${p.pivot.quantity}`)
                                .join("، ")
                            : "—"}
                        </TableCell>
                        <TableCell className="text-sm text-center">
                          {new Date(order.created_at).toLocaleString("ar-SA")}
                        </TableCell>
                        <TableCell className="font-medium text-center">
                          {order.total} ر.س
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant={getStatusVariant(order.status)}>
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex gap-1 justify-center">
                            {/* 🟢 صلاحية معالجة الطلبات */}
                            {hasPermission("orders_process") && (
                              <>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  title="تحويل إلى قيد التنفيذ"
                                  className="hover:bg-green-100 text-green-600"
                                  onClick={() =>
                                    handleUpdateStatus(order.id, "قيد التنفيذ")
                                  }
                                >
                                  <Check className="w-4 h-4" />
                                </Button>

                                <Button
                                  size="sm"
                                  variant="ghost"
                                  title="تحويل إلى تم التسليم"
                                  className="hover:bg-blue-100 text-blue-600"
                                  onClick={() =>
                                    handleUpdateStatus(order.id, "تم التسليم")
                                  }
                                >
                                  <Truck className="w-4 h-4" />
                                </Button>

                                <Button
                                  size="sm"
                                  variant="ghost"
                                  title="إلغاء الطلب"
                                  className="hover:bg-red-100 text-red-600"
                                  onClick={() =>
                                    handleUpdateStatus(order.id, "ملغي")
                                  }
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </>
                            )}

                            {/* 🔴 صلاحية حذف الطلب */}
                            {hasPermission("orders_delete") && (
                              <Button
                                size="sm"
                                variant="ghost"
                                title="حذف الطلب نهائيًا"
                                className="hover:bg-destructive/10 text-destructive flex items-center justify-center"
                                onClick={() => handleDelete(order.id)}
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
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminOrders;
