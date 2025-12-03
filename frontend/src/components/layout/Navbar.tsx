import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Menu,
  X,
  Home,
  DoorOpen,
  Briefcase,
  Trophy,
  Phone,
  Settings,
  User,
  Bot,
  LogOut,
} from "lucide-react";
import { useState, useEffect } from "react";
import { ThemeToggle } from "./ThemeToggle";
import { CartSheet } from "@/components/cart/CartSheet";
import { NotificationSheet } from "@/components/notifications/NotificationSheet";
import { useAuthStore } from "@/store/useAuthStore";
import { getSettings, Settings as SettingsType } from "@/api/settings";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const { user, logout, hasPermission } = useAuthStore();

  const [settings, setSettings] = useState<SettingsType>({});

  useEffect(() => {
    getSettings()
      .then((res) => setSettings(res.data))
      .catch(() => console.warn("فشل في جلب إعدادات الموقع"));
  }, []);

  const navLinks = [
    { name: "الرئيسية", path: "/", icon: Home },
    { name: "الغرف", path: "/rooms", icon: DoorOpen },
    { name: "الخدمات", path: "/services", icon: Briefcase },
    { name: "المباريات", path: "/matches", icon: Trophy },
    { name: "البوت", path: "/bot", icon: Bot },
    { name: "تواصل معنا", path: "/contact", icon: Phone },
    {
      name: "لوحة التحكم",
      path: "/admin",
      icon: Settings,
      permission: "dashboard_access",
    },
  ];

  const isActive = (path: string) => location.pathname === path;

  const logoSrc =
    settings.logo instanceof File
      ? URL.createObjectURL(settings.logo)
      : settings.logo || "/BN_dream.png";

  return (
    <nav className="fixed top-0 right-0 left-0 z-50 bg-background/95 backdrop-blur-md border-b border-border shadow-sm">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-1.5 sm:gap-2 animate-fade-in-right shrink-0"
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-slate-100 flex items-center justify-center shadow-elegant overflow-hidden">
              <img
                src={logoSrc}
                alt="شعار الموقع"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-base sm:text-xl font-bold bg-gradient-to-l from-primary to-accent bg-clip-text text-transparent hidden sm:inline-block">
              نادي واستراحة بي إن دريم
            </span>
            <span className="text-sm font-bold bg-gradient-to-l from-primary to-accent bg-clip-text text-transparent sm:hidden">
              بي إن إيدريم
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1 flex-1 justify-center mx-4">
            {navLinks
              .filter((link) => !link.permission || hasPermission(link.permission))
              .map((link, index) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <Button
                    variant={isActive(link.path) ? "default" : "ghost"}
                    size="sm"
                    className="gap-2 transition-smooth hover-lift"
                  >
                    <link.icon className="h-4 w-4" />
                    <span className="hidden xl:inline">{link.name}</span>
                  </Button>
                </Link>
              ))}
          </div>

          {/* Desktop Right Side */}
          <div className="hidden lg:flex items-center gap-2 animate-fade-in-left shrink-0">
            <NotificationSheet />
            <CartSheet />
            <ThemeToggle />
            {user ? (
              <Button
                onClick={logout}
                variant="destructive"
                size="sm"
                className="gap-2 shadow-elegant"
              >
                <LogOut className="h-4 w-4" />
                تسجيل الخروج
              </Button>
            ) : (
              <Link to="/auth">
                <Button size="sm" className="gap-2 shadow-elegant">
                  <User className="h-4 w-4" />
                  تسجيل الدخول
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile */}
          <div className="flex lg:hidden items-center gap-1.5 sm:gap-2 shrink-0">
            <NotificationSheet />
            <CartSheet />
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg hover:bg-muted transition-smooth active:scale-95"
            >
              {isOpen ? (
                <X className="h-5 w-5 sm:h-6 sm:w-6" />
              ) : (
                <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden py-3 sm:py-4 space-y-1.5 sm:space-y-2 animate-fade-in-down">
            {navLinks
              .filter((link) => !link.permission || hasPermission(link.permission))
              .map((link) => (
                <Link key={link.path} to={link.path} onClick={() => setIsOpen(false)}>
                  <Button
                    variant={isActive(link.path) ? "default" : "ghost"}
                    size="sm"
                    className="w-full justify-start gap-2"
                  >
                    <link.icon className="h-4 w-4" />
                    {link.name}
                  </Button>
                </Link>
              ))}

            <div className="pt-2 border-t border-border/50">
              {user ? (
                <Button
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                  variant="destructive"
                  size="sm"
                  className="w-full gap-2 shadow-elegant"
                >
                  <LogOut className="h-4 w-4" />
                  تسجيل الخروج
                </Button>
              ) : (
                <Link to="/auth" onClick={() => setIsOpen(false)}>
                  <Button size="sm" className="w-full gap-2 shadow-elegant">
                    <User className="h-4 w-4" />
                    تسجيل الدخول
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
