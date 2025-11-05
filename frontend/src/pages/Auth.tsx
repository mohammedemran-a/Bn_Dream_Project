import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import Navbar from "@/components/layout/Navbar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogIn, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { AxiosError } from "axios";

const Auth = () => {
  const navigate = useNavigate();
  const { login, register } = useAuthStore();

  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(loginData); // استخدم Zustand
      toast.success("تم تسجيل الدخول بنجاح ✅");
      navigate("/");
    } catch (error: unknown) {
      const err = error as AxiosError<{ message?: string }>;
      toast.error(err.response?.data?.message || "فشل تسجيل الدخول ❌");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(registerData); // استخدم Zustand
      toast.success("تم إنشاء الحساب بنجاح ✅");
      navigate("/");
    } catch (error: unknown) {
      const err = error as AxiosError<{ message?: string }>;
      toast.error(err.response?.data?.message || "فشل إنشاء الحساب ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background">
      <Navbar />
      <main className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-md">
          <Card className="card-gradient border-2 shadow-elegant animate-scale-in">
            <CardHeader className="text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-4">
                <span className="text-primary-foreground font-bold text-2xl">ا</span>
              </div>
              <CardTitle className="text-3xl">مرحباً بك</CardTitle>
              <CardDescription className="text-base">
                سجل دخولك أو أنشئ حساباً جديداً للمتابعة
              </CardDescription>
            </CardHeader>

            <CardContent>
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="login" className="gap-2">
                    <LogIn className="h-4 w-4" />
                    تسجيل الدخول
                  </TabsTrigger>
                  <TabsTrigger value="register" className="gap-2">
                    <UserPlus className="h-4 w-4" />
                    إنشاء حساب
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="login">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        البريد الإلكتروني
                      </label>
                      <Input
                        placeholder="example@email.com"
                        value={loginData.email}
                        onChange={(e) =>
                          setLoginData({ ...loginData, email: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        كلمة المرور
                      </label>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        value={loginData.password}
                        onChange={(e) =>
                          setLoginData({ ...loginData, password: e.target.value })
                        }
                        required
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full shadow-elegant"
                      disabled={loading}
                    >
                      تسجيل الدخول
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="register">
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        الاسم الكامل
                      </label>
                      <Input
                        placeholder="أدخل اسمك"
                        value={registerData.name}
                        onChange={(e) =>
                          setRegisterData({ ...registerData, name: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        البريد الإلكتروني
                      </label>
                      <Input
                        type="email"
                        placeholder="example@email.com"
                        value={registerData.email}
                        onChange={(e) =>
                          setRegisterData({ ...registerData, email: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        رقم الهاتف
                      </label>
                      <Input
                        type="tel"
                        placeholder="05xxxxxxxx"
                        value={registerData.phone}
                        onChange={(e) =>
                          setRegisterData({ ...registerData, phone: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        كلمة المرور
                      </label>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        value={registerData.password}
                        onChange={(e) =>
                          setRegisterData({ ...registerData, password: e.target.value })
                        }
                        required
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full shadow-elegant"
                      disabled={loading}
                    >
                      إنشاء حساب
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Auth;
