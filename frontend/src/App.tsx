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

// الحماية
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import GuestRoute from "@/components/auth/GuestRoute";

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

                {/* صفحة تسجيل الدخول — تظهر فقط للضيوف */}
                <Route
                  path="/auth"
                  element={
                    <GuestRoute>
                      <Auth />
                    </GuestRoute>
                  }
                />

                {/* الصفحة الرئيسية — محمية */}
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <Index />
                    </ProtectedRoute>
                  }
                />

                {/* صفحات المستخدم — محمية */}
                <Route
                  path="/rooms"
                  element={
                    <ProtectedRoute>
                      <Rooms />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/services"
                  element={
                    <ProtectedRoute>
                      <Services />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/matches"
                  element={
                    <ProtectedRoute>
                      <Matches />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/bot"
                  element={
                    <ProtectedRoute>
                      <Bot />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/contact"
                  element={
                    <ProtectedRoute>
                      <Contact />
                    </ProtectedRoute>
                  }
                />

                {/* صفحات الإدارة — محمية */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/admin/rooms"
                  element={
                    <ProtectedRoute>
                      <AdminRooms />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/admin/bookings"
                  element={
                    <ProtectedRoute>
                      <AdminBookings />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/admin/services"
                  element={
                    <ProtectedRoute>
                      <AdminServices />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/admin/orders"
                  element={
                    <ProtectedRoute>
                      <AdminOrders />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/admin/matches"
                  element={
                    <ProtectedRoute>
                      <AdminMatches />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/admin/users"
                  element={
                    <ProtectedRoute>
                      <AdminUsers />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/admin/roles"
                  element={
                    <ProtectedRoute>
                      <AdminRoles />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/admin/notifications"
                  element={
                    <ProtectedRoute>
                      <AdminNotifications />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/admin/settings"
                  element={
                    <ProtectedRoute>
                      <AdminSettings />
                    </ProtectedRoute>
                  }
                />

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
