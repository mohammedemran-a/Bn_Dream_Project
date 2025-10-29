import Navbar from "@/components/layout/Navbar";         // 1. استيراد الشريط العلوي
import { AdminSidebar } from "./AdminSidebar";           // 2. استيراد الشريط الجانبي

export const AdminLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-background">
      {/* الشريط العلوي الثابت */}
      <Navbar />

      {/* حاوية المحتوى الرئيسي (تبدأ بعد الشريط العلوي) */}
      <div className="flex pt-16"> {/* pt-16 = padding-top: 4rem (لترك مسافة للشريط العلوي) */}
        
        {/* الشريط الجانبي الخاص بالإدارة */}
        <AdminSidebar />

        {/* المحتوى الفعلي للصفحة (يأخذ المساحة المتبقية) */}
        <main className="flex-1 p-8 overflow-y-auto h-[calc(100vh-4rem)]">
          {children}
        </main>
      </div>
    </div>
  );
};
