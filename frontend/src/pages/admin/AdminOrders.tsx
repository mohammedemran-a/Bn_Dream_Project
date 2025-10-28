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
import { Check, Truck, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { getAllOrders, updateOrderStatus } from "@/api/orders";

// نوع الطلب
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
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // 🟢 جلب الطلبات من السيرفر
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

  // 🟢 تحديث حالة الطلب
  const handleUpdateStatus = async (id: number, newStatus: string) => {
    try {
      await updateOrderStatus(id, newStatus);
      toast.success("تم تحديث حالة الطلب");
      fetchOrders(); // إعادة تحميل الطلبات بعد التحديث
    } catch (error) {
      console.error(error);
      toast.error("فشل تحديث حالة الطلب");
    }
  };

  // عند تحميل الصفحة لأول مرة
  useEffect(() => {
    fetchOrders();
  }, []);

  // 🟢 لون الشارة حسب الحالة
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
                      <TableHead className="w-[120px] text-center">
                        المستخدم
                      </TableHead>
                      <TableHead className="w-[130px] text-center">
                        رقم الهاتف
                      </TableHead>
                      <TableHead className="w-[250px] text-center">
                        المنتجات
                      </TableHead>
                      <TableHead className="w-[180px] text-center">
                        التاريخ
                      </TableHead>
                      <TableHead className="w-[100px] text-center">
                        المبلغ
                      </TableHead>
                      <TableHead className="w-[100px] text-center">
                        الحالة
                      </TableHead>
                      <TableHead className="w-[100px] text-center">
                        العمليات
                      </TableHead>
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
                          {order.products && order.products.length > 0
                            ? order.products
                                .map(
                                  (p) =>
                                    `${p.name} × ${p.pivot.quantity}`
                                )
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
                          <div className="flex gap-2 justify-center">
                            {order.status === "جديد" && (
                              <Button
                                size="sm"
                                variant="ghost"
                                className="hover:bg-success/10 text-success"
                                onClick={() =>
                                  handleUpdateStatus(order.id, "قيد التنفيذ")
                                }
                              >
                                <Check className="w-4 h-4" />
                              </Button>
                            )}
                            {order.status === "قيد التنفيذ" && (
                              <Button
                                size="sm"
                                variant="ghost"
                                className="hover:bg-primary/10"
                                onClick={() =>
                                  handleUpdateStatus(order.id, "تم التسليم")
                                }
                              >
                                <Truck className="w-4 h-4" />
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="ghost"
                              className="hover:bg-destructive/10 text-destructive"
                              onClick={() =>
                                handleUpdateStatus(order.id, "ملغي")
                              }
                            >
                              <X className="w-4 h-4" />
                            </Button>
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
