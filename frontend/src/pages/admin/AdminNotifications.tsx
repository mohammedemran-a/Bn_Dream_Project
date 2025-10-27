import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const notificationsData = [
  { 
    id: 1, 
    title: "تأكيد حجز",
    message: "تم تأكيد حجزك في جناح VIP",
    type: "حجز",
    date: "2025-10-22 14:30",
    sent: true
  },
  { 
    id: 2, 
    title: "عرض خاص",
    message: "خصم 20% على جميع الغرف هذا الأسبوع",
    type: "عام",
    date: "2025-10-21 10:00",
    sent: true
  },
  { 
    id: 3, 
    title: "طلب جديد",
    message: "تم استلام طلبك من البقالة",
    type: "خدمة",
    date: "2025-10-22 16:15",
    sent: true
  },
];

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState(notificationsData);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const getTypeVariant = (type: string) => {
    switch (type) {
      case "حجز": return "default";
      case "خدمة": return "secondary";
      case "عام": return "outline";
      default: return "outline";
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">الإشعارات</h1>
            <p className="text-muted-foreground">إدارة الإشعارات المرسلة عبر الموقع</p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 shadow-elegant">
                <Plus className="w-4 h-4" />
                إرسال إشعار جديد
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>إرسال إشعار جديد</DialogTitle>
              </DialogHeader>
              <form className="space-y-4">
                <div>
                  <Label htmlFor="title">العنوان</Label>
                  <Input id="title" placeholder="عنوان الإشعار" />
                </div>
                <div>
                  <Label htmlFor="message">الرسالة</Label>
                  <Textarea 
                    id="message" 
                    placeholder="محتوى الإشعار..."
                    rows={4}
                  />
                </div>
                <div>
                  <Label htmlFor="type">نوع الإشعار</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر النوع" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="booking">حجز</SelectItem>
                      <SelectItem value="service">خدمة</SelectItem>
                      <SelectItem value="general">عام</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2 justify-end">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    إلغاء
                  </Button>
                  <Button type="submit">إرسال الآن</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>الإشعارات المرسلة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div 
                  key={notification.id}
                  className="flex items-start gap-4 p-4 bg-accent/5 rounded-lg hover:bg-accent/10 transition-colors border border-border"
                >
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Bell className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-bold text-lg">{notification.title}</h3>
                      <Badge variant={getTypeVariant(notification.type)}>
                        {notification.type}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground mb-2">{notification.message}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{notification.date}</span>
                      {notification.sent && (
                        <Badge variant="outline" className="text-success border-success">
                          تم الإرسال
                        </Badge>
                      )}
                    </div>
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
