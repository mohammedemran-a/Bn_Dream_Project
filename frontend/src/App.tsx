import React, { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { CartProvider } from "@/contexts/CartContext";

// صفحات المستخدم
import Index from "./pages/Index";
import Rooms from "./pages/Rooms";
import Services from "./pages/Services";
import Matches from "./pages/Matches";
import Contact from "./pages/Contact";
import Auth from "./pages/Auth";
import Bot from "./pages/Bot";
import NotFound from "./pages/NotFound";

// صفحات الإدارة
import Dashboard from "./pages/admin/Dashboard";
import AdminRooms from "./pages/admin/AdminRooms";
import AdminBookings from "./pages/admin/AdminBookings";
import AdminServices from "./pages/admin/AdminServices";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminMatches from "./pages/admin/AdminMatches";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminRoles from "./pages/admin/AdminRoles";
import AdminNotifications from "./pages/admin/AdminNotifications";
import AdminSettings from "./pages/admin/AdminSettings";

// Zustand Store
import { useAuthStore } from "@/store/useAuthStore";

import AdminAds from "./pages/admin/AdminAds";

const queryClient = new QueryClient();

const App = () => {
  const fetchUser = useAuthStore((state) => state.fetchUser);
  const loading = useAuthStore((state) => state.loading);

  // جلب بيانات المستخدم عند بدء التطبيق
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-xl">
        جاري التحميل...
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <CartProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>

                {/* صفحات المستخدم */}
                <Route path="/auth" element={<Auth />} />
                <Route path="/" element={<Index />} />
                <Route path="/rooms" element={<Rooms />} />
                <Route path="/services" element={<Services />} />
                <Route path="/matches" element={<Matches />} />
                <Route path="/bot" element={<Bot />} />
                <Route path="/contact" element={<Contact />} />

                {/* صفحات الإدارة */}
                <Route path="/admin" element={<Dashboard />} />
                <Route path="/admin/rooms" element={<AdminRooms />} />
                <Route path="/admin/bookings" element={<AdminBookings />} />
                <Route path="/admin/services" element={<AdminServices />} />
                <Route path="/admin/orders" element={<AdminOrders />} />
                <Route path="/admin/matches" element={<AdminMatches />} />
                <Route path="/admin/ads" element={<AdminAds />} />
                <Route path="/admin/users" element={<AdminUsers />} />
                <Route path="/admin/roles" element={<AdminRoles />} />
                <Route path="/admin/notifications" element={<AdminNotifications />} />
                <Route path="/admin/settings" element={<AdminSettings />} />

                {/* صفحة غير موجودة */}
                <Route path="*" element={<NotFound />} />

              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </CartProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
