import React, { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getSettings, updateSettings } from '@/api/settings.js';

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    siteName: "",
    siteDescription: "",
    logo: "",
    email: "",
    phone: "",
    whatsapp: "",
    telegram: "",
  });
  
  const [logoFile, setLogoFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setLoading(true);
    getSettings()
      .then((response) => setSettings(prev => ({ ...prev, ...response.data })))
      .catch(() => setMessage("فشل في جلب الإعدادات."))
      .finally(() => setLoading(false));
  }, []);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setSettings((prev) => ({ ...prev, [id]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setLogoFile(e.target.files[0]);
    }
  };

  const handleSave = () => {
    setLoading(true);
    setMessage("");
    const formData = new FormData();

    Object.keys(settings).forEach((key) => {
      if (key === 'logo' && logoFile) return;
      if (settings[key] !== null) {
        formData.append(key, settings[key]);
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
              <Input id="siteName" value={settings.siteName || ''} onChange={handleInputChange} disabled={loading} />
            </div>
            <div>
              <Label htmlFor="siteDescription">وصف الموقع</Label>
              <Input id="siteDescription" value={settings.siteDescription || ''} onChange={handleInputChange} disabled={loading} />
            </div>
            <div>
              <Label htmlFor="logo">الشعار</Label>
              {settings.logo && <img src={settings.logo} alt="الشعار الحالي" className="my-2 h-16 w-auto rounded bg-slate-200" />}
              <Input id="logo" type="file" onChange={handleFileChange} disabled={loading} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>إعدادات الاتصال</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div><Label htmlFor="email">البريد الإلكتروني</Label><Input id="email" type="email" value={settings.email || ''} onChange={handleInputChange} disabled={loading} /></div>
            <div><Label htmlFor="phone">رقم الهاتف</Label><Input id="phone" value={settings.phone || ''} onChange={handleInputChange} disabled={loading} /></div>
            <div><Label htmlFor="whatsapp">رقم الواتساب</Label><Input id="whatsapp" value={settings.whatsapp || ''} onChange={handleInputChange} disabled={loading} /></div>
            <div><Label htmlFor="telegram">معرف التليجرام</Label><Input id="telegram" value={settings.telegram || ''} onChange={handleInputChange} disabled={loading} /></div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
            <Button onClick={handleSave} disabled={loading} size="lg">
              {loading ? "جاري الحفظ..." : "حفظ كل التغييرات"}
            </Button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
