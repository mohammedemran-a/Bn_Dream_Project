import { useEffect, useState, useCallback } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getBookings, updateBooking, deleteBooking } from "@/api/bookings";
import { useAuthStore } from "@/store/useAuthStore";

interface Booking {
  id: number;
  user?: { name: string };
  room?: { name: string };
  user_id?: number;
  room_id?: number;
  check_in: string;
  check_out: string;
  guests: number;
  total_price: number;
  status: string;
}

const AdminBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("الكل");
  const [loading, setLoading] = useState<boolean>(true);
  const hasPermission = useAuthStore(state => state.hasPermission);

  const fetchBookings = useCallback(async () => {
    if (!hasPermission("bookings_view")) return;
    try {
      setLoading(true);
      const res = await getBookings(statusFilter);
      setBookings(res.data || []);
    } catch (error) {
      console.error("فشل في جلب الحجوزات:", error);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, hasPermission]);

  const changeStatus = async (id: number, newStatus: string) => {
    if (!hasPermission("bookings_edit")) return;
    try {
      await updateBooking(id, { status: newStatus });
      fetchBookings();
    } catch (error) {
      console.error("فشل في تحديث الحالة:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!hasPermission("bookings_delete")) return;
    if (!confirm("هل أنت متأكد من حذف هذا الحجز؟")) return;
    try {
      await deleteBooking(id);
      fetchBookings();
    } catch (error) {
      console.error("فشل في حذف الحجز:", error);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "مؤكد":
        return "default";
      case "قيد المراجعة":
        return "secondary";
      case "ملغي":
        return "destructive";
      default:
        return "outline";
    }
  };

  if (!hasPermission("bookings_view")) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-xl text-red-500 font-semibold">
            🚫 ليس لديك صلاحية عرض الحجوزات
          </p>
        </div>
      </AdminLayout>
    );
  }

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
            {loading ? (
              <p className="text-center py-6">جاري تحميل الحجوزات...</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>المستخدم</TableHead>
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
                  {bookings.length > 0 ? (
                    bookings.map((booking) => (
                      <TableRow key={booking.id} className="hover:bg-accent/5">
                        <TableCell>{booking.user?.name || `#${booking.user_id}`}</TableCell>
                        <TableCell>{booking.room?.name || `#${booking.room_id}`}</TableCell>
                        <TableCell>{booking.check_in}</TableCell>
                        <TableCell>{booking.check_out}</TableCell>
                        <TableCell>{booking.guests}</TableCell>
                        <TableCell>{booking.total_price} ريال</TableCell>
                        <TableCell>
                          <Badge variant={getStatusVariant(booking.status)}>
                            {booking.status || "قيد المراجعة"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            {hasPermission("bookings_edit") && booking.status === "قيد المراجعة" && (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="hover:bg-success/10 text-success"
                                  onClick={() => changeStatus(booking.id, "مؤكد")}
                                >
                                  تأكيد
                                </Button>

                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="hover:bg-destructive/10 text-destructive"
                                  onClick={() => changeStatus(booking.id, "ملغي")}
                                >
                                  إلغاء
                                </Button>
                              </>
                            )}

                            {hasPermission("bookings_delete") && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="hover:bg-destructive/20 text-destructive"
                                onClick={() => handleDelete(booking.id)}
                              >
                                حذف
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-6">
                        لا توجد حجوزات حالياً
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminBookings;
