import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getNotifications,
  markNotificationAsRead,
  deleteNotification,
  clearAllNotifications,
} from "@/api/notifications";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Bell, X, Check } from "lucide-react";

export const NotificationSheet = ({
  open,
  onOpenChange,
  showTrigger = true,
}: {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  showTrigger?: boolean;
}) => {
  const queryClient = useQueryClient();
  const [internalOpen, setInternalOpen] = useState(false);

  const isControlled = open !== undefined && onOpenChange !== undefined;
  const actualOpen = isControlled ? open : internalOpen;
  const actualOnOpenChange = isControlled ? onOpenChange : setInternalOpen;

  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: getNotifications,
  });

  // ✅ Mutation لتحديد كمقروء
  const markAsReadMutation = useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });

  // ✅ Mutation لحذف الإشعار
  const deleteMutation = useMutation({
    mutationFn: deleteNotification,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });

  // ✅ Mutation لحذف الكل
  const clearAllMutation = useMutation({
    mutationFn: clearAllNotifications,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });

  const unreadCount = notifications.filter((n) => !n.read_at).length;

  return (
    <Sheet open={actualOpen} onOpenChange={actualOnOpenChange} modal={false}>
      {showTrigger && (
        <SheetTrigger asChild>
          <Button variant="ghost" size="sm" className="relative p-2">
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center text-[10px]"
              >
                {unreadCount}
              </Badge>
            )}
          </Button>
        </SheetTrigger>
      )}

      <SheetContent side="left" className="w-full sm:w-[400px]">
        {/* ✅ العنوان مع زر حذف الكل في الأعلى */}
        <SheetHeader className="flex flex-row items-center justify-between">
          <div>
            <SheetTitle className="flex items-center gap-2">
              الإشعارات
              {unreadCount > 0 && <Badge variant="secondary">{unreadCount} جديد</Badge>}
            </SheetTitle>
            <SheetDescription>إشعارات النظام الخاصة بالمستخدم.</SheetDescription>
          </div>

          {notifications.length > 0 && (
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
        </SheetHeader>

        {/* ✅ قائمة الإشعارات */}
        <ScrollArea className="h-[calc(100vh-120px)] mt-6">
          {isLoading && <p>جاري التحميل...</p>}

          {!isLoading && notifications.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">
              <Bell className="h-12 w-12 mx-auto mb-3 opacity-20" />
              <p>لا توجد إشعارات</p>
            </div>
          )}

          <div className="space-y-2">
            {notifications.map((notification, index) => (
              <div key={notification.id}>
                <div
                  className={`p-4 rounded-lg transition hover:bg-muted ${
                    !notification.read_at ? "bg-primary/5" : ""
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="font-semibold text-sm mb-1">{notification.data.title}</p>
                      <p className="text-sm text-muted-foreground mb-2">
                        {notification.data.message}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(notification.created_at).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      {!notification.read_at && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 hover:bg-green-100 text-green-600"
                          title="تعليم كمقروء"
                          onClick={() => markAsReadMutation.mutate(notification.id)}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 hover:bg-destructive/10 hover:text-destructive"
                        title="حذف الإشعار"
                        onClick={() => deleteMutation.mutate(notification.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                {index < notifications.length - 1 && <Separator className="my-2" />}
              </div>
            ))}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
