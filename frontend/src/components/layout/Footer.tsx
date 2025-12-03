import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Phone, Mail, MapPin } from "lucide-react";
import { getSettings } from "@/api/settings.js";

const Footer = () => {
  // حالة لتخزين الإعدادات مع قيم افتراضية
  const [settings, setSettings] = useState({
    siteName: "نظام استراحة بي إن دريم",
    siteDescription: "استمتع بأفضل تجربة للراحة والفخامة مع خدماتنا المتميزة وغرفنا العصرية المصممة لتوفر لك تجربة لا تنسى.",
    logo: "",
    phone: "",
    email: "",
    // يمكنك إضافة حقول أخرى مثل العنوان إذا أضفتها في لوحة التحكم
  });

  // جلب الإعدادات عند تحميل المكون
  useEffect(() => {
    getSettings()
      .then(response => {
        if (response.data) {
          // دمج البيانات القادمة مع الافتراضية لضمان عدم وجود قيم فارغة
          setSettings(prev => ({ ...prev, ...response.data }));
        }
      })
      .catch(error => {
        console.error("Failed to fetch settings for Footer:", error);
      });
  }, []);

  return (
    <footer className="bg-card border-t border-border mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* قسم "حول الموقع" (ديناميكي) */}
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center gap-2">
              {settings.logo ? (
                <img src={settings.logo} alt="Site Logo" className="w-10 h-10 rounded-full object-cover" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-xl">ا</span>
                </div>
              )}
              <h3 className="text-xl font-bold">{settings.siteName}</h3>
            </div>
            <p className="text-muted-foreground">
              {settings.siteDescription}
            </p>
          </div>

          {/* قسم "روابط سريعة" (ثابت) */}
          <div className="space-y-4 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <h3 className="text-lg font-semibold">روابط سريعة</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-muted-foreground hover:text-primary transition-smooth animated-underline">الرئيسية</Link></li>
              <li><Link to="/rooms" className="text-muted-foreground hover:text-primary transition-smooth animated-underline">الغرف</Link></li>
              <li><Link to="/services" className="text-muted-foreground hover:text-primary transition-smooth animated-underline">الخدمات</Link></li>
              <li><Link to="/matches" className="text-muted-foreground hover:text-primary transition-smooth animated-underline">المباريات</Link></li>
            </ul>
          </div>

          {/* قسم "تواصل معنا" (ديناميكي ومع روابط قابلة للنقر) */}
          <div className="space-y-4 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <h3 className="text-lg font-semibold">تواصل معنا</h3>
            <ul className="space-y-3">
              {settings.phone && (
                <li className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-4 w-4 text-primary" />
                  {/* ✅ الإصلاح: إضافة وسم <a> مع `tel:` */}
                  <a href={`tel:${settings.phone}`} className="hover:text-primary transition-colors">
                    {settings.phone}
                  </a>
                </li>
              )}
              {settings.email && (
                <li className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4 text-primary" />
                  {/* ✅ الإصلاح: إضافة وسم <a> مع `mailto:` */}
                  <a href={`mailto:${settings.email}`} className="hover:text-primary transition-colors">
                    {settings.email}
                  </a>
                </li>
              )}
              {/* العنوان لا يزال ثابتًا لأنه غير موجود في لوحة التحكم حاليًا */}
              <li className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4 text-primary" />
                <span>صنعاء، اليمن</span>
              </li>
            </ul>
          </div>

          {/* قسم "تابعنا" (ثابت) */}
          <div className="space-y-4 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <h3 className="text-lg font-semibold">تابعنا</h3>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-smooth hover-lift"><Facebook className="h-5 w-5" /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-smooth hover-lift"><Twitter className="h-5 w-5" /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-smooth hover-lift"><Instagram className="h-5 w-5" /></a>
            </div>
          </div>
        </div>

        {/* قسم حقوق النشر (ديناميكي) */}
        <div className="mt-8 pt-8 border-t border-border text-center text-muted-foreground">
          <p>© 2024 {settings.siteName}. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
