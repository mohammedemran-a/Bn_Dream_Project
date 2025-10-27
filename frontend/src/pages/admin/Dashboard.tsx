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
  ResponsiveContainer 
} from "recharts";

const statsData = [
  { icon: BedDouble, label: "إجمالي الحجوزات", value: "156", change: "+12%" },
  { icon: Users, label: "عدد المستخدمين", value: "89", change: "+8%" },
  { icon: ShoppingCart, label: "الطلبات", value: "234", change: "+23%" },
  { icon: DollarSign, label: "الإيرادات", value: "45,230 ريال", change: "+15%" },
];

const chartData = [
  { name: "السبت", bookings: 12 },
  { name: "الأحد", bookings: 19 },
  { name: "الاثنين", bookings: 15 },
  { name: "الثلاثاء", bookings: 22 },
  { name: "الأربعاء", bookings: 18 },
  { name: "الخميس", bookings: 25 },
  { name: "الجمعة", bookings: 28 },
];

const recentBookings = [
  { id: 1, user: "أحمد محمد", room: "جناح VIP", date: "2025-10-25", status: "مؤكد" },
  { id: 2, user: "سارة علي", room: "غرفة عائلية", date: "2025-10-24", status: "قيد المراجعة" },
  { id: 3, user: "محمد خالد", room: "غرفة ديلوكس", date: "2025-10-23", status: "مؤكد" },
];

const recentOrders = [
  { id: 1, user: "فاطمة أحمد", type: "بقالة", amount: "150 ريال", status: "قيد التنفيذ" },
  { id: 2, user: "عمر سعيد", type: "شيش", amount: "80 ريال", status: "تم التسليم" },
  { id: 3, user: "نورة محمد", type: "قات", amount: "200 ريال", status: "جديد" },
];

const Dashboard = () => {
  return (
    <AdminLayout>
      <div className="space-y-8 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold mb-2">لوحة التحكم</h1>
          <p className="text-muted-foreground">نظرة عامة على نشاط النظام</p>
        </div>

        {/* Stats Cards */}
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

        {/* Chart */}
        <Card className="animate-fade-in" style={{ animationDelay: "400ms" }}>
          <CardHeader>
            <CardTitle>الحجوزات اليومية</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px"
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

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Bookings */}
          <Card className="animate-fade-in" style={{ animationDelay: "500ms" }}>
            <CardHeader>
              <CardTitle>آخر الحجوزات</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentBookings.map((booking) => (
                  <div 
                    key={booking.id}
                    className="flex items-center justify-between p-4 bg-accent/5 rounded-lg hover:bg-accent/10 transition-colors"
                  >
                    <div>
                      <p className="font-medium">{booking.user}</p>
                      <p className="text-sm text-muted-foreground">{booking.room}</p>
                    </div>
                    <div className="text-left">
                      <p className="text-sm text-muted-foreground">{booking.date}</p>
                      <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
                        {booking.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Orders */}
          <Card className="animate-fade-in" style={{ animationDelay: "600ms" }}>
            <CardHeader>
              <CardTitle>آخر الطلبات</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div 
                    key={order.id}
                    className="flex items-center justify-between p-4 bg-accent/5 rounded-lg hover:bg-accent/10 transition-colors"
                  >
                    <div>
                      <p className="font-medium">{order.user}</p>
                      <p className="text-sm text-muted-foreground">{order.type}</p>
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium">{order.amount}</p>
                      <span className="text-xs px-2 py-1 bg-secondary/10 text-secondary rounded-full">
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
