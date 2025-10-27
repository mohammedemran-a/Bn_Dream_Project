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
import { Check, Clock, Truck, X } from "lucide-react";

const ordersData = [
  { 
    id: 1, 
    user: "أحمد محمد",
    phone: "0501234567",
    type: "بقالة", 
    items: "ماء معدني × 5، شيبسي × 3",
    date: "2025-10-22 14:30",
    status: "جديد",
    total: 49
  },
  { 
    id: 2, 
    user: "سارة علي",
    phone: "0507654321",
    type: "شيش", 
    items: "شيشة تفاح × 2",
    date: "2025-10-22 13:15",
    status: "قيد التنفيذ",
    total: 100
  },
  { 
    id: 3, 
    user: "محمد خالد",
    phone: "0509876543",
    type: "قات", 
    items: "قات يافعي",
    date: "2025-10-22 12:00",
    status: "تم التسليم",
    total: 150
  },
];

const AdminOrders = () => {
  const [orders, setOrders] = useState(ordersData);

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "جديد": return "secondary";
      case "قيد التنفيذ": return "default";
      case "تم التسليم": return "outline";
      case "ملغي": return "destructive";
      default: return "outline";
    }
  };

  const updateOrderStatus = (orderId: number, newStatus: string) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  return (
    <AdminLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold mb-2">الطلبات الواردة</h1>
          <p className="text-muted-foreground">عرض طلبات المستخدمين وإدارتها</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>قائمة الطلبات</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>المستخدم</TableHead>
                  <TableHead>رقم الهاتف</TableHead>
                  <TableHead>نوع الطلب</TableHead>
                  <TableHead>المنتجات</TableHead>
                  <TableHead>التاريخ</TableHead>
                  <TableHead>المبلغ</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead className="text-right">العمليات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id} className="hover:bg-accent/5">
                    <TableCell className="font-medium">{order.user}</TableCell>
                    <TableCell className="font-mono text-sm">{order.phone}</TableCell>
                    <TableCell>{order.type}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{order.items}</TableCell>
                    <TableCell className="text-sm">{order.date}</TableCell>
                    <TableCell className="font-medium">{order.total} ريال</TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(order.status)}>
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        {order.status === "جديد" && (
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="hover:bg-success/10 text-success"
                            onClick={() => updateOrderStatus(order.id, "قيد التنفيذ")}
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                        )}
                        {order.status === "قيد التنفيذ" && (
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="hover:bg-primary/10"
                            onClick={() => updateOrderStatus(order.id, "تم التسليم")}
                          >
                            <Truck className="w-4 h-4" />
                          </Button>
                        )}
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="hover:bg-destructive/10 text-destructive"
                          onClick={() => updateOrderStatus(order.id, "ملغي")}
                        >
                          <X className="w-4 h-4" />
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

export default AdminOrders;
