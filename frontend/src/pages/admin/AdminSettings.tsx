// src/pages/admin/AdminSettings.tsx
import React, { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getSettings, updateSettings, Settings } from "@/api/settings";
import { useAuthStore } from "@/store/useAuthStore";

const AdminSettings: React.FC = () => {
  const hasPermission = useAuthStore((state) => state.hasPermission);

  const [settings, setSettings] = useState<Settings>({
    siteName: "",
    siteDescription: "",
    logo: "",
    email: "",
    phone: "",
  });

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // تحميل الإعدادات
  useEffect(() => {
    if (!hasPermission("settings_view")) return;

    setLoading(true);
    getSettings()
      .then((response) => setSettings((prev) => ({ ...prev, ...response.data })))
      .catch(() => setMessage("فشل في جلب الإعدادات."))
      .finally(() => setLoading(false));
  }, [hasPermission]);

  // تحديث الحقول النصية
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    setSettings((prev) => ({ ...prev, [id]: newValue }));
  };

  // تحديث الشعار (ملف)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLogoFile(e.target.files[0]);
    }
  };

  // حفظ الإعدادات
  const handleSave = async () => {
    if (!hasPermission("settings_edit")) return;

    setLoading(true);
    setMessage("");

    const formData = new FormData();

    Object.entries(settings).forEach(([key, value]) => {
      // نتجاهل logo هنا لأنه يعالج لاحقاً
      if (key === "logo" && logoFile) return;

      if (value instanceof File) {
        formData.append(key, value);
      } else if (typeof value === "boolean" || typeof value === "number") {
        formData.append(key, String(value));
      } else if (typeof value === "string") {
        formData.append(key, value);
      }
    });

    if (logoFile) {
      formData.append("logo", logoFile);
    }

    try {
      const response = await updateSettings(formData);
      setSettings((prev) => ({ ...prev, ...response.data }));
      setLogoFile(null);
      setMessage("✅ تم حفظ الإعدادات بنجاح!");
    } catch {
      setMessage("❌ حدث خطأ أثناء حفظ الإعدادات.");
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  // صلاحية العرض
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

        {message && (
          <p className="text-sm p-3 bg-muted rounded-md transition-all">
            {message}
          </p>
        )}

        {/* إعدادات الموقع */}
        <Card>
          <CardHeader>
            <CardTitle>إعدادات الموقع</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="siteName">اسم الموقع</Label>
              <Input
                id="siteName"
                value={String(settings.siteName ?? "")}
                onChange={handleInputChange}
                disabled={!isEditable || loading}
              />
            </div>

            <div>
              <Label htmlFor="siteDescription">وصف الموقع</Label>
              <Input
                id="siteDescription"
                value={String(settings.siteDescription ?? "")}
                onChange={handleInputChange}
                disabled={!isEditable || loading}
              />
            </div>

            <div>
              <Label htmlFor="logo">الشعار</Label>
              {settings.logo && (
                <img
                  src={
                    settings.logo instanceof File
                      ? URL.createObjectURL(settings.logo)
                      : (settings.logo as string) || "/default-logo.png"
                  }
                  alt="الشعار الحالي"
                  className="my-2 h-16 w-auto rounded bg-slate-200"
                />
              )}
              <Input
                id="logo"
                type="file"
                onChange={handleFileChange}
                disabled={!isEditable || loading}
              />
            </div>
          </CardContent>
        </Card>

        {/* إعدادات الاتصال */}
        <Card>
          <CardHeader>
            <CardTitle>إعدادات الاتصال</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input
                id="email"
                type="email"
                value={String(settings.email ?? "")}
                onChange={handleInputChange}
                disabled={!isEditable || loading}
              />
            </div>

            <div>
              <Label htmlFor="phone">رقم الهاتف</Label>
              <Input
                id="phone"
                value={String(settings.phone ?? "")}
                onChange={handleInputChange}
                disabled={!isEditable || loading}
              />
            </div>
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
