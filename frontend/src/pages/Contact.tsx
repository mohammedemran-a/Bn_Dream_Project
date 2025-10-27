import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Mail, MapPin, Send } from "lucide-react";
import { useState } from "react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    alert("تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.");
    setFormData({ name: "", email: "", phone: "", message: "" });
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-16">
        {/* Page Header */}
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
                          placeholder="أدخل اسمك"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">البريد الإلكتروني</label>
                        <Input
                          type="email"
                          placeholder="example@email.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">رقم الهاتف</label>
                        <Input
                          type="tel"
                          placeholder="+967 777 123 456"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">رسالتك</label>
                        <Textarea
                          placeholder="اكتب رسالتك هنا..."
                          rows={5}
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          required
                        />
                      </div>
                      <Button type="submit" className="w-full shadow-elegant gap-2">
                        <Send className="h-4 w-4" />
                        إرسال الرسالة
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>

              {/* Contact Info */}
              <div className="space-y-6 animate-fade-in-left">
                <Card className="card-gradient border-2 hover-lift">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <Phone className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>اتصل بنا</CardTitle>
                    <CardDescription className="text-lg">
                      +967 777 123 456
                      <br />
                      +967 777 654 321
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card className="card-gradient border-2 hover-lift">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <Mail className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>راسلنا</CardTitle>
                    <CardDescription className="text-lg">
                      info@golden-resort.com
                      <br />
                      support@golden-resort.com
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card className="card-gradient border-2 hover-lift">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <MapPin className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>موقعنا</CardTitle>
                    <CardDescription className="text-lg">
                      شارع الجمهورية
                      <br />
                      صنعاء، اليمن
                    </CardDescription>
                  </CardHeader>
                </Card>

                {/* Map */}
                <Card className="overflow-hidden border-2">
                  <div className="h-64 bg-muted">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3838.0!2d44.2!3d15.3!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTXCsDE4JzAwLjAiTiA0NMKwMTInMDAuMCJF!5e0!3m2!1sen!2s!4v1234567890"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>
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
