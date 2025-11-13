import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getNotifications,
  markNotificationAsRead,
  deleteNotification,
  clearAllNotifications,
} from "@/api/notifications";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, X, Check } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/useAuthStore"; // ✅ إضافة الاستور للتحقق من الصلاحيات

const AdminNotifications = () => {
  const queryClient = useQueryClient();
  const hasPermission = useAuthStore((s) => s.hasPermission); // ✅ دالة التحقق من الصلاحيات

const token = localStorage.getItem("token");

const { data: notifications = [], isLoading, isError } = useQuery({
  queryKey: ["notifications"],
  queryFn: getNotifications,
  enabled: !!token, // ✅ لن يعمل إذا لم يوجد توكن
  retry: false, // ⛔ لا تحاول إعادة الجلب عند الخطأ 401
});

  const markAsReadMutation = useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteNotification,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });

  const clearAllMutation = useMutation({
    mutationFn: clearAllNotifications,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });

  // ✅ صلاحية عرض الصفحة
  if (!hasPermission("notifications_view")) {
    return (
      <AdminLayout>
        <p className="text-center text-red-600 text-lg mt-10">
          🚫 ليس لديك صلاحية عرض الإشعارات
        </p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* ✅ العنوان مع زر حذف الكل */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold mb-2">الإشعارات</h1>

          {/* ✅ صلاحية حذف الإشعارات */}
          {hasPermission("notifications_delete") && notifications.length > 0 && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                if (confirm("هل أنت متأكد من حذف جميع الإشعارات؟")) {
                  clearAllMutation.mutate();
                }
              }}
            >
              حذف الكل
            </Button>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>الإشعارات المرسلة</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading && (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-20 w-full rounded-lg" />
                ))}
              </div>
            )}

            {isError && <p className="text-red-500 text-sm">حدث خطأ أثناء تحميل الإشعارات</p>}

            {!isLoading && notifications.length === 0 && (
              <p className="text-muted-foreground text-center py-6">
                لا توجد إشعارات حالياً
              </p>
            )}

            <div className="space-y-4">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className={`flex items-start justify-between p-4 rounded-lg border transition ${
                    !n.read_at ? "bg-primary/5" : "bg-background"
                  }`}
                >
                  <div className="flex gap-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <Bell className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{n.data.title}</h3>
                      <p className="text-muted-foreground">{n.data.message}</p>
                      <small className="text-muted-foreground">
                        {new Date(n.created_at).toLocaleString()}
                      </small>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {!n.read_at && (
                      <Button
                        size="icon"
                        variant="ghost"
                        title="تعليم كمقروء"
                        onClick={() => markAsReadMutation.mutate(n.id)}
                      >
                        <Check className="h-4 w-4 text-green-600" />
                      </Button>
                    )}

                    {/* ✅ صلاحية حذف الإشعارات */}
                    {hasPermission("notifications_delete") && (
                      <Button
                        size="icon"
                        variant="ghost"
                        title="حذف"
                        onClick={() => deleteMutation.mutate(n.id)}
                      >
                        <X className="h-4 w-4 text-red-600" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminNotifications;
