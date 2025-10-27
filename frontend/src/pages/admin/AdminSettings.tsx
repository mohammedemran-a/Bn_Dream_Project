import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

const AdminSettings = () => {
  return (
    <AdminLayout>
      <div className="space-y-6 animate-fade-in max-w-4xl">
        <div>
          <h1 className="text-3xl font-bold mb-2">الإعدادات</h1>
          <p className="text-muted-foreground">ضبط النظام العام</p>
        </div>

        {/* Site Settings */}
        <Card>
          <CardHeader>
            <CardTitle>إعدادات الموقع</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="siteName">اسم الموقع</Label>
              <Input id="siteName" defaultValue="استراحة الفخامة" />
            </div>
            <div>
              <Label htmlFor="siteDescription">وصف الموقع</Label>
              <Input id="siteDescription" defaultValue="أفضل استراحة في المنطقة" />
            </div>
            <div>
              <Label htmlFor="logo">رابط الشعار</Label>
              <Input id="logo" placeholder="https://..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="primaryColor">اللون الأساسي</Label>
                <Input id="primaryColor" type="color" defaultValue="#D4AF37" />
              </div>
              <div>
                <Label htmlFor="accentColor">اللون الثانوي</Label>
                <Input id="accentColor" type="color" defaultValue="#FFD700" />
              </div>
            </div>
            <Button>حفظ التغييرات</Button>
          </CardContent>
        </Card>

        {/* Contact Settings */}
        <Card>
          <CardHeader>
            <CardTitle>إعدادات الاتصال</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input id="email" type="email" placeholder="info@example.com" />
            </div>
            <div>
              <Label htmlFor="phone">رقم الهاتف</Label>
              <Input id="phone" placeholder="+966 50 123 4567" />
            </div>
            <div>
              <Label htmlFor="whatsapp">رقم الواتساب</Label>
              <Input id="whatsapp" placeholder="+966 50 123 4567" />
            </div>
            <div>
              <Label htmlFor="telegram">معرف التليجرام</Label>
              <Input id="telegram" placeholder="@username" />
            </div>
            <Button>حفظ التغييرات</Button>
          </CardContent>
        </Card>

        {/* Automation Settings */}
        <Card>
          <CardHeader>
            <CardTitle>إعدادات الأتمتة</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="autoConfirm">تأكيد الحجوزات تلقائياً</Label>
                <p className="text-sm text-muted-foreground">
                  تأكيد الحجوزات فوراً بدون مراجعة يدوية
                </p>
              </div>
              <Switch id="autoConfirm" />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="reminderNotifications">إشعارات التذكير</Label>
                <p className="text-sm text-muted-foreground">
                  إرسال تذكيرات للعملاء قبل موعد الحجز
                </p>
              </div>
              <Switch id="reminderNotifications" defaultChecked />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="emailNotifications">الإشعارات بالبريد</Label>
                <p className="text-sm text-muted-foreground">
                  إرسال نسخ من الإشعارات عبر البريد الإلكتروني
                </p>
              </div>
              <Switch id="emailNotifications" />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="smsNotifications">الإشعارات بالرسائل</Label>
                <p className="text-sm text-muted-foreground">
                  إرسال رسائل نصية للعملاء عند التحديثات المهمة
                </p>
              </div>
              <Switch id="smsNotifications" defaultChecked />
            </div>
            
            <Button>حفظ التغييرات</Button>
          </CardContent>
        </Card>

        {/* Bot Settings */}
        <Card>
          <CardHeader>
            <CardTitle>إعدادات البوت</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="botToken">رمز بوت التليجرام</Label>
              <Input id="botToken" type="password" placeholder="Bot Token" />
            </div>
            <div>
              <Label htmlFor="whatsappApi">مفتاح WhatsApp API</Label>
              <Input id="whatsappApi" type="password" placeholder="API Key" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="botEnabled">تفعيل البوت</Label>
                <p className="text-sm text-muted-foreground">
                  تفعيل استقبال الطلبات عبر البوت
                </p>
              </div>
              <Switch id="botEnabled" defaultChecked />
            </div>
            <Button>حفظ التغييرات</Button>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
