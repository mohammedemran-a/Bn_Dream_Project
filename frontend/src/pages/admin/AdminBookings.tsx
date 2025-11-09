import { useState } from "react";
import { useQuery, useMutation, useQueryClient, UseQueryResult } from "@tanstack/react-query";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getBookings, updateBookingStatus, deleteBooking, Booking } from "@/api/bookings.ts";
import { useAuthStore } from "@/store/useAuthStore";

const AdminBookings = () => {
  const [statusFilter, setStatusFilter] = useState<string>("الكل");
  const hasPermission = useAuthStore((s) => s.hasPermission);
  const queryClient = useQueryClient();

  const query: UseQueryResult<Booking[], Error> = useQuery<Booking[], Error>({
    queryKey: ["bookings", statusFilter],
    queryFn: () => getBookings(statusFilter),
  });

  const bookings = query.data ?? [];
  const isLoading = query.isLoading;

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) => updateBookingStatus(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["bookings", statusFilter] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteBooking(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["bookings", statusFilter] }),
  });

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
        <p className="text-center text-red-600 text-lg mt-10">
          🚫 ليس لديك صلاحية عرض الحجوزات
        </p>
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
          {/* ✅ تعديل هذا الجزء فقط لمحاذاة العنوان والقائمة */}
          <CardHeader>
            <div dir="rtl" className="flex justify-between items-center">
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
            {isLoading ? (
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
                      <TableRow key={booking.id}>
                        <TableCell>{booking.user?.name || `#${booking.user_id}`}</TableCell>
                        <TableCell>{booking.room?.name || `#${booking.room_id}`}</TableCell>
                        <TableCell>{booking.check_in}</TableCell>
                        <TableCell>{booking.check_out}</TableCell>
                        <TableCell>{booking.guests}</TableCell>
                        <TableCell>{booking.total_price} ريال</TableCell>
                        <TableCell>
                          <Badge variant={getStatusVariant(booking.status)}>
                            {booking.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right flex gap-2 justify-end">
                          {hasPermission("bookings_edit") && booking.status === "قيد المراجعة" && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-green-600"
                                onClick={() =>
                                  updateStatusMutation.mutate({ id: booking.id, status: "مؤكد" })
                                }
                              >
                                تأكيد
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-red-600"
                                onClick={() =>
                                  updateStatusMutation.mutate({ id: booking.id, status: "ملغي" })
                                }
                              >
                                إلغاء
                              </Button>
                            </>
                          )}
                          {hasPermission("bookings_delete") && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-destructive"
                              onClick={() => {
                                if (confirm("هل أنت متأكد من حذف هذا الحجز؟"))
                                  deleteMutation.mutate(booking.id);
                              }}
                            >
                              حذف
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-6">
                        لا توجد حجوزات لعرضها
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
