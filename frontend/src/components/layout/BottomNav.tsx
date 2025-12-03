import { Link, useLocation } from "react-router-dom";
import { Home, DoorOpen, Briefcase, Trophy, Bot } from "lucide-react";

const BottomNav = () => {
  const location = useLocation();

  const navItems = [
    { name: "الرئيسية", path: "/", icon: Home },
    { name: "الغرف", path: "/rooms", icon: DoorOpen },
    { name: "الخدمات", path: "/services", icon: Briefcase },
    { name: "المباريات", path: "/matches", icon: Trophy },
    { name: "البوت", path: "/bot", icon: Bot },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="lg:hidden fixed bottom-0 right-0 left-0 z-50 bg-background/95 backdrop-blur-md border-t border-border shadow-lg">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-all duration-200 min-w-[60px] ${
                active
                  ? "text-primary scale-105"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              <Icon className={`h-5 w-5 ${active ? "animate-bounce-in" : ""}`} />
              <span className={`text-xs font-medium ${active ? "font-bold" : ""}`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;