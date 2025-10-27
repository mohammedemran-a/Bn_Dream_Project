import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bot as BotIcon, Send } from "lucide-react";
import { useState } from "react";

const Bot = () => {
  const [messages, setMessages] = useState<{ text: string; sender: "user" | "bot" }[]>([
    { text: "مرحباً! أنا بوت نظام استراحة بي إن إيدريم. كيف يمكنني مساعدتك اليوم؟", sender: "bot" }
  ]);
  const [inputMessage, setInputMessage] = useState("");

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    setMessages([...messages, { text: inputMessage, sender: "user" }]);
    
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        text: "شكراً لتواصلك معنا. سيتم الرد على استفسارك في أقرب وقت ممكن.", 
        sender: "bot" 
      }]);
    }, 1000);

    setInputMessage("");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in">
            <BotIcon className="w-16 h-16 mx-auto mb-4 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-primary-glow to-primary bg-clip-text text-transparent">
              بوت الاستراحة
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              مساعدك الذكي للإجابة على جميع استفساراتك وحجوزاتك
            </p>
          </div>

          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BotIcon className="w-5 h-5" />
                محادثة مباشرة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 mb-4 min-h-[400px] max-h-[500px] overflow-y-auto p-4 bg-accent/5 rounded-lg">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[70%] p-3 rounded-lg ${
                        message.sender === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      {message.text}
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendMessage} className="flex gap-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="اكتب رسالتك هنا..."
                  className="flex-1"
                />
                <Button type="submit" className="gap-2">
                  <Send className="w-4 h-4" />
                  إرسال
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="mt-12 grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">الحجوزات</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  يمكن للبوت مساعدتك في حجز الغرف والخدمات
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">الاستفسارات</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  احصل على إجابات فورية لجميع أسئلتك
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">الدعم الفني</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  مساعدة فورية على مدار الساعة
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Bot;
