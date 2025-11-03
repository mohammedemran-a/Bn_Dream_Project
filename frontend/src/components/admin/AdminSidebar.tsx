import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  BedDouble, 
  Calendar, 
  ShoppingBag, 
  ShoppingCart,
  Trophy,
  Users,
  Shield,
  Bell,
  Settings,
  LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { icon: LayoutDashboard, label: "لوحة التحكم", path: "/admin" },
  { icon: BedDouble, label: "إدارة الغرف", path: "/admin/rooms" },
  { icon: Calendar, label: "إدارة الحجوزات", path: "/admin/bookings" },
  { icon: ShoppingBag, label: "إدارة الخدمات", path: "/admin/services" },
  { icon: ShoppingCart, label: "الطلبات الواردة", path: "/admin/orders" },
  { icon: Trophy, label: "إدارة المباريات", path: "/admin/matches" },
  { icon: Users, label: "إدارة المستخدمين", path: "/admin/users" },
  { icon: Shield, label: "الأدوار والصلاحيات", path: "/admin/roles" },
  { icon: Bell, label: "الإشعارات", path: "/admin/notifications" },
  { icon: Settings, label: "الإعدادات", path: "/admin/settings" },
];

export const AdminSidebar = () => {
  const location = useLocation();

  return (
    <aside className="w-64 min-h-screen bg-card border-l border-border sticky top-0">
      <div className="p-6 border-b border-border">
        <h2 className="text-xl font-bold bg-gradient-to-l from-primary to-accent bg-clip-text text-transparent">
          لوحة التحكم
        </h2>
      </div>
      
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300",
                "hover:bg-accent/10 hover:translate-x-[-4px]",
                isActive && "bg-primary/10 text-primary border-r-4 border-primary"
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
        
        <button
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 hover:bg-destructive/10 hover:text-destructive text-muted-foreground mt-8"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">تسجيل الخروج</span>
        </button>
      </nav>
    </aside>
  );
};
