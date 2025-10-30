import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Home, DoorOpen, Briefcase, Trophy, Phone, User, Bot, Settings } from "lucide-react";
import { useState } from "react";
import { ThemeToggle } from "./ThemeToggle";
import { CartSheet } from "@/components/cart/CartSheet";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: "الرئيسية", path: "/", icon: Home },
    { name: "الغرف", path: "/rooms", icon: DoorOpen },
    { name: "الخدمات", path: "/services", icon: Briefcase },
    { name: "المباريات", path: "/matches", icon: Trophy },
    { name: "البوت", path: "/bot", icon: Bot },
    { name: "تواصل معنا", path: "/contact", icon: Phone },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 right-0 left-0 z-50 bg-background/95 backdrop-blur-md border-b border-border shadow-sm">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo - Responsive */}
          <Link to="/" className="flex items-center gap-1.5 sm:gap-2 animate-fade-in-right shrink-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-elegant">
              <span className="text-primary-foreground font-bold text-lg sm:text-xl">ا</span>
            </div>
            <span className="text-base sm:text-xl font-bold bg-gradient-to-l from-primary to-accent bg-clip-text text-transparent hidden sm:inline-block">
              نظام استراحة بي إن إيدريم
            </span>
            <span className="text-sm font-bold bg-gradient-to-l from-primary to-accent bg-clip-text text-transparent sm:hidden">
              بي إن إيدريم
            </span>
          </Link>

          {/* Desktop Navigation - Hidden on mobile and tablet */}
          <div className="hidden lg:flex items-center gap-1 flex-1 justify-center mx-4">
            {navLinks.map((link, index) => (
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
            <Link to="/admin" className="animate-fade-in">
              <Button
                variant={isActive("/admin") ? "default" : "outline"}
                size="sm"
                className="gap-2 transition-smooth hover-lift"
              >
                <Settings className="h-4 w-4" />
                <span className="hidden xl:inline">لوحة التحكم</span>
              </Button>
            </Link>
          </div>

          {/* Desktop Right Side - Hidden on mobile */}
          <div className="hidden lg:flex items-center gap-2 animate-fade-in-left shrink-0">
            <CartSheet />
            <ThemeToggle />
            <Link to="/auth">
              <Button size="sm" className="gap-2 shadow-elegant">
                <User className="h-4 w-4" />
                <span className="hidden xl:inline">تسجيل الدخول</span>
              </Button>
            </Link>
          </div>

          {/* Mobile/Tablet Right Side */}
          <div className="flex lg:hidden items-center gap-1.5 sm:gap-2 shrink-0">
            <CartSheet />
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg hover:bg-muted transition-smooth active:scale-95"
              aria-label="القائمة"
            >
              {isOpen ? (
                <X className="h-5 w-5 sm:h-6 sm:w-6 transition-transform duration-200" />
              ) : (
                <Menu className="h-5 w-5 sm:h-6 sm:w-6 transition-transform duration-200" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile/Tablet Menu - Smooth slide animation */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="py-3 sm:py-4 space-y-1.5 sm:space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className="block"
              >
                <Button
                  variant={isActive(link.path) ? "default" : "ghost"}
                  size="sm"
                  className="w-full justify-start gap-2 transition-smooth hover-lift active:scale-[0.98]"
                >
                  <link.icon className="h-4 w-4" />
                  {link.name}
                </Button>
              </Link>
            ))}
            <Link to="/admin" onClick={() => setIsOpen(false)} className="block">
              <Button
                variant={isActive("/admin") ? "default" : "outline"}
                size="sm"
                className="w-full justify-start gap-2 transition-smooth hover-lift active:scale-[0.98]"
              >
                <Settings className="h-4 w-4" />
                لوحة التحكم
              </Button>
            </Link>
            <div className="pt-2 border-t border-border/50">
              <Link to="/auth" onClick={() => setIsOpen(false)} className="block">
                <Button size="sm" className="w-full gap-2 shadow-elegant active:scale-[0.98]">
                  <User className="h-4 w-4" />
                  تسجيل الدخول
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
