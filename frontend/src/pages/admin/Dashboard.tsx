import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BedDouble, Users, ShoppingCart, DollarSign, TrendingUp } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { getBookings } from "@/api/bookings";
import { getAllOrders } from "@/api/orders";
import { getUser } from "@/api/auth";
import { toast } from "sonner";
import { useAuthStore } from "@/store/useAuthStore";


const Dashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const hasPermission = useAuthStore(state => state.hasPermission);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookingsRes, ordersRes, userRes] = await Promise.all([
          getBookings(),
          getAllOrders(),
          getUser(),
        ]);

        setBookings(bookingsRes?.data || []);
        setOrders(ordersRes || []);
        setUsers(userRes?.data ? [userRes.data] : []);
      } catch (error) {
        console.error("حدث خطأ أثناء تحميل البيانات:", error);
        toast.error("فشل تحميل البيانات، يرجى تسجيل الدخول مجددًا");
        localStorage.removeItem("token");
        window.location.href = "/auth";
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // ✅ نتحقق من الصلاحية بعد استدعاء جميع الـ hooks
  if (!hasPermission("dashboard_view")) {
    return (
      <AdminLayout>
        <div className="p-10 text-center text-destructive text-lg font-semibold">
          🚫 ليس لديك صلاحية عرض لوحة التحكم
        </div>
      </AdminLayout>
    );
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-10 text-center text-lg">جاري تحميل البيانات...</div>
      </AdminLayout>
    );
  }

  const totalRevenue = orders.reduce(
    (sum, o) => sum + (parseFloat(o.amount) || 0),
    0
  );

  // 📊 بيانات الكروت العلوية
  const statsData = [
    {
      icon: BedDouble,
      label: "إجمالي الحجوزات",
      value: bookings.length,
      change: "+12%",
    },
    {
      icon: Users,
      label: "عدد المستخدمين",
      value: users.length,
      change: "+8%",
    },
    {
      icon: ShoppingCart,
      label: "عدد الطلبات",
      value: orders.length,
      change: "+23%",
    },
    {
      icon: DollarSign,
      label: "إجمالي الإيرادات",
      value: `${totalRevenue} ريال`,
      change: "+15%",
    },
  ];

  // 📈 رسم بياني للحجوزات اليومية
  const chartData = (() => {
    const days = [
      "السبت",
      "الأحد",
      "الاثنين",
      "الثلاثاء",
      "الأربعاء",
      "الخميس",
      "الجمعة",
    ];
    const counts: Record<string, number> = {};
    bookings.forEach((b) => {
      const date = new Date(b.date || b.created_at);
      const dayName = days[date.getDay()];
      counts[dayName] = (counts[dayName] || 0) + 1;
    });
    return days.map((day) => ({ name: day, bookings: counts[day] || 0 }));
  })();

  return (
    <AdminLayout>
      <div className="space-y-8 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold mb-2">لوحة التحكم</h1>
          <p className="text-muted-foreground">نظرة عامة على نشاط النظام</p>
        </div>

        {/* الكروت الإحصائية */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsData.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card
                key={index}
                className="hover:shadow-elegant transition-all duration-300 hover:scale-105 animate-scale-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </CardTitle>
                  <Icon className="w-5 h-5 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingUp className="w-4 h-4 text-success" />
                    <span className="text-sm text-success">{stat.change}</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* الرسم البياني */}
        <Card className="animate-fade-in" style={{ animationDelay: "400ms" }}>
          <CardHeader>
            <CardTitle>الحجوزات اليومية</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="bookings"
                  stroke="hsl(var(--primary))"
                  strokeWidth={3}
                  dot={{ fill: "hsl(var(--primary))", r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
