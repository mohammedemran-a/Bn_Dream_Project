import React, { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getSettings, updateSettings } from '@/api/settings.js';
import { useAuthStore } from "@/store/useAuthStore";


const AdminSettings = () => {
  const hasPermission = useAuthStore(state => state.hasPermission);
  const [settings, setSettings] = useState({
    siteName: "",
    siteDescription: "",
    logo: "",
    email: "",
    phone: "",
    whatsapp: "",
    telegram: "",
  });

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!hasPermission("settings_view")) return; // ✅ لن نقوم بالتحميل إذا لم يمتلك الصلاحية
    setLoading(true);
    getSettings()
      .then((response) => setSettings(prev => ({ ...prev, ...response.data })))
      .catch(() => setMessage("فشل في جلب الإعدادات."))
      .finally(() => setLoading(false));
  }, [hasPermission]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setSettings((prev) => ({ ...prev, [id]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLogoFile(e.target.files[0]);
    }
  };

  const handleSave = () => {
    if (!hasPermission("settings_edit")) return; // ✅ لا يسمح بالحفظ بدون الصلاحية
    setLoading(true);
    setMessage("");
    const formData = new FormData();

    Object.keys(settings).forEach((key) => {
      if (key === 'logo' && logoFile) return;
      if (settings[key as keyof typeof settings] !== null) {
        formData.append(key, settings[key as keyof typeof settings]);
      }
    });

    if (logoFile) {
      formData.append("logo", logoFile);
    }

    updateSettings(formData)
      .then((response) => {
        setSettings(prev => ({ ...prev, ...response.data })); 
        setLogoFile(null);
        setMessage("تم حفظ الإعدادات بنجاح!");
      })
      .catch(() => setMessage("حدث خطأ أثناء حفظ الإعدادات."))
      .finally(() => {
        setLoading(false);
        setTimeout(() => setMessage(""), 3000);
      });
  };

  // ✅ التحقق من صلاحية العرض قبل أي شيء
  if (!hasPermission("settings_view")) {
    return (
      <AdminLayout>
        <div className="p-10 text-center text-destructive text-lg font-semibold">
          🚫 ليس لديك صلاحية عرض الإعدادات
        </div>
      </AdminLayout>
    );
  }

  const isEditable = hasPermission("settings_edit");

  return (
    <AdminLayout>
      <div className="space-y-6 animate-fade-in max-w-4xl pb-12">
        <div>
          <h1 className="text-3xl font-bold mb-2">الإعدادات</h1>
          <p className="text-muted-foreground">ضبط النظام العام</p>
        </div>

        {message && <p className="text-sm p-3 bg-muted rounded-md">{message}</p>}

        <Card>
          <CardHeader><CardTitle>إعدادات الموقع</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="siteName">اسم الموقع</Label>
              <Input id="siteName" value={settings.siteName || ''} onChange={handleInputChange} disabled={!isEditable || loading} />
            </div>
            <div>
              <Label htmlFor="siteDescription">وصف الموقع</Label>
              <Input id="siteDescription" value={settings.siteDescription || ''} onChange={handleInputChange} disabled={!isEditable || loading} />
            </div>
            <div>
              <Label htmlFor="logo">الشعار</Label>
              {settings.logo && <img src={settings.logo} alt="الشعار الحالي" className="my-2 h-16 w-auto rounded bg-slate-200" />}
              <Input id="logo" type="file" onChange={handleFileChange} disabled={!isEditable || loading} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>إعدادات الاتصال</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div><Label htmlFor="email">البريد الإلكتروني</Label><Input id="email" type="email" value={settings.email || ''} onChange={handleInputChange} disabled={!isEditable || loading} /></div>
            <div><Label htmlFor="phone">رقم الهاتف</Label><Input id="phone" value={settings.phone || ''} onChange={handleInputChange} disabled={!isEditable || loading} /></div>
            <div><Label htmlFor="whatsapp">رقم الواتساب</Label><Input id="whatsapp" value={settings.whatsapp || ''} onChange={handleInputChange} disabled={!isEditable || loading} /></div>
            <div><Label htmlFor="telegram">معرف التليجرام</Label><Input id="telegram" value={settings.telegram || ''} onChange={handleInputChange} disabled={!isEditable || loading} /></div>
          </CardContent>
        </Card>

        {isEditable && (
          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={loading} size="lg">
              {loading ? "جاري الحفظ..." : "حفظ كل التغييرات"}
            </Button>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
