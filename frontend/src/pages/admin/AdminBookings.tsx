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
import { Check, X, Eye } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const bookingsData = [
  { 
    id: 1, 
    user: "أحمد محمد", 
    phone: "0501234567",
    room: "جناح VIP", 
    checkIn: "2025-10-25", 
    checkOut: "2025-10-27",
    guests: 4,
    status: "قيد المراجعة",
    total: 1600
  },
  { 
    id: 2, 
    user: "سارة علي", 
    phone: "0507654321",
    room: "غرفة عائلية", 
    checkIn: "2025-10-24", 
    checkOut: "2025-10-25",
    guests: 6,
    status: "مؤكد",
    total: 500
  },
  { 
    id: 3, 
    user: "محمد خالد", 
    phone: "0509876543",
    room: "غرفة ديلوكس", 
    checkIn: "2025-10-26", 
    checkOut: "2025-10-28",
    guests: 3,
    status: "ملغي",
    total: 1200
  },
];

const AdminBookings = () => {
  const [bookings, setBookings] = useState(bookingsData);
  const [statusFilter, setStatusFilter] = useState("الكل");

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "مؤكد": return "default";
      case "قيد المراجعة": return "secondary";
      case "ملغي": return "destructive";
      default: return "outline";
    }
  };

  const filteredBookings = statusFilter === "الكل" 
    ? bookings 
    : bookings.filter(b => b.status === statusFilter);

  return (
    <AdminLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold mb-2">إدارة الحجوزات</h1>
          <p className="text-muted-foreground">متابعة جميع الحجوزات وتحديث حالتها</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>قائمة الحجوزات</CardTitle>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="تصفية حسب الحالة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="الكل">الكل</SelectItem>
                  <SelectItem value="مؤكد">مؤكد</SelectItem>
                  <SelectItem value="قيد المراجعة">قيد المراجعة</SelectItem>
                  <SelectItem value="ملغي">ملغي</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>المستخدم</TableHead>
                  <TableHead>رقم الهاتف</TableHead>
                  <TableHead>الغرفة</TableHead>
                  <TableHead>الوصول</TableHead>
                  <TableHead>المغادرة</TableHead>
                  <TableHead>الضيوف</TableHead>
                  <TableHead>المبلغ</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead className="text-right">العمليات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBookings.map((booking) => (
                  <TableRow key={booking.id} className="hover:bg-accent/5">
                    <TableCell className="font-medium">{booking.user}</TableCell>
                    <TableCell className="font-mono text-sm">{booking.phone}</TableCell>
                    <TableCell>{booking.room}</TableCell>
                    <TableCell>{booking.checkIn}</TableCell>
                    <TableCell>{booking.checkOut}</TableCell>
                    <TableCell>{booking.guests}</TableCell>
                    <TableCell className="font-medium">{booking.total} ريال</TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(booking.status)}>
                        {booking.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Button size="sm" variant="ghost" className="hover:bg-primary/10">
                          <Eye className="w-4 h-4" />
                        </Button>
                        {booking.status === "قيد المراجعة" && (
                          <>
                            <Button size="sm" variant="ghost" className="hover:bg-success/10 text-success">
                              <Check className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="ghost" className="hover:bg-destructive/10 text-destructive">
                              <X className="w-4 h-4" />
                            </Button>
                          </>
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

export default AdminBookings;
