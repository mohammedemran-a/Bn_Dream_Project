import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Mail, MapPin, Send } from "lucide-react";
import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { sendContactMessage, ContactMessage, ContactResponse } from "@/api/contacts";
import { getSettings, Settings } from "@/api/settings";
import type { AxiosError } from "axios";

// ✅ استيراد التوست من Sonner
import { toast } from "sonner";

const Contact = () => {
  const [formData, setFormData] = useState<ContactMessage>({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const [settings, setSettings] = useState<Settings>({
    phone: "",
    email: "",
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await getSettings();
        setSettings(response.data);
      } catch (error) {
        console.error("❌ خطأ في جلب الإعدادات:", error);
        toast.error("حدث خطأ أثناء تحميل الإعدادات.");
      }
    };

    fetchSettings();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response: ContactResponse = await sendContactMessage(formData);
      console.log("Server response:", response);

      // ✅ Toast بدل alert
      toast.success("تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.");

      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      console.error("❌ خطأ أثناء إرسال الرسالة:", err.response?.data?.message || err.message);

      // ❌ alert  
      // ⭕️ Toast
      toast.error("حدث خطأ أثناء الإرسال، حاول مجدداً.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-16">
        <section className="bg-gradient-to-b from-primary/10 to-background py-20 px-4">
          <div className="container mx-auto text-center space-y-4 animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold">تواصل معنا</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              نحن هنا للإجابة على جميع استفساراتك
            </p>
          </div>
        </section>

        <section className="py-12 px-4">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

              {/* Contact Form */}
              <div className="animate-fade-in-right">
                <Card className="card-gradient border-2">
                  <CardHeader>
                    <CardTitle className="text-2xl">أرسل لنا رسالة</CardTitle>
                    <CardDescription>
                      املأ النموذج وسنتواصل معك في أقرب وقت ممكن
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">الاسم الكامل</label>
                        <Input
                          name="name"
                          placeholder="أدخل اسمك"
                          value={formData.name}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">البريد الإلكتروني</label>
                        <Input
                          name="email"
                          type="email"
                          placeholder="example@email.com"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">رقم الهاتف</label>
                        <Input
                          name="phone"
                          type="tel"
                          placeholder="+967"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">رسالتك</label>
                        <Textarea
                          name="message"
                          placeholder="اكتب رسالتك هنا..."
                          rows={5}
                          value={formData.message}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <Button type="submit" className="w-full shadow-elegant gap-2" disabled={loading}>
                        {loading ? "جارٍ الإرسال..." : (
                          <>
                            <Send className="h-4 w-4" />
                            إرسال الرسالة
                          </>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>

              {/* Contact Info */}
              <div className="space-y-6 animate-fade-in-left">
                {/* Phone Card */}
                <Card className="card-gradient border-2 hover-lift">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <Phone className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>اتصل بنا</CardTitle>
                    <CardDescription className="text-lg">
                      {String(settings.phone || "+967")}
                    </CardDescription>
                  </CardHeader>
                </Card>

                {/* Email Card */}
                <Card className="card-gradient border-2 hover-lift">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <Mail className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>البريد الإلكتروني</CardTitle>
                    <CardDescription className="text-lg">
                      {String(settings.email || "example@email.com")}
                    </CardDescription>
                  </CardHeader>
                </Card>

                {/* Address Card */}
                <Card className="card-gradient border-2 hover-lift">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <MapPin className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>موقعنا</CardTitle>
                    <CardDescription className="text-lg">
                      شارع مذبح مقابل معامل العبسي للتصوير الرقمي
                      <br />
                      صنعاء، اليمن
                    </CardDescription>
                  </CardHeader>
                </Card>
              </div>

            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
