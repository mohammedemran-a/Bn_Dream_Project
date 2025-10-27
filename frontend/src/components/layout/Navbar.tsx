import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Home, DoorOpen, Briefcase, Trophy, Phone, User, Bot, Settings } from "lucide-react";
import { useState } from "react";
import { ThemeToggle } from "./ThemeToggle";

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
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 animate-fade-in-right">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-elegant">
              <span className="text-primary-foreground font-bold text-xl">ا</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-l from-primary to-accent bg-clip-text text-transparent">
              نظام استراحة بي إن إيدريم
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link, index) => (
              <Link
                key={link.path}
                to={link.path}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <Button
                  variant={isActive(link.path) ? "default" : "ghost"}
                  className="gap-2 transition-smooth hover-lift"
                >
                  <link.icon className="h-4 w-4" />
                  {link.name}
                </Button>
              </Link>
            ))}
            <Link to="/admin" className="animate-fade-in">
              <Button
                variant={isActive("/admin") ? "default" : "outline"}
                className="gap-2 transition-smooth hover-lift"
              >
                <Settings className="h-4 w-4" />
                لوحة التحكم
              </Button>
            </Link>
            <ThemeToggle />
          </div>

          {/* Auth Button */}
          <div className="hidden md:block animate-fade-in-left">
            <Link to="/auth">
              <Button className="gap-2 shadow-elegant">
                <User className="h-4 w-4" />
                تسجيل الدخول
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button & Theme Toggle */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg hover:bg-muted transition-smooth"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 animate-slide-up">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                >
                  <Button
                    variant={isActive(link.path) ? "default" : "ghost"}
                    className="w-full justify-start gap-2"
                  >
                    <link.icon className="h-4 w-4" />
                    {link.name}
                  </Button>
                </Link>
              ))}
              <Link to="/admin" onClick={() => setIsOpen(false)}>
                <Button
                  variant={isActive("/admin") ? "default" : "outline"}
                  className="w-full justify-start gap-2"
                >
                  <Settings className="h-4 w-4" />
                  لوحة التحكم
                </Button>
              </Link>
              <Link to="/auth" onClick={() => setIsOpen(false)}>
                <Button className="w-full gap-2">
                  <User className="h-4 w-4" />
                  تسجيل الدخول
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
