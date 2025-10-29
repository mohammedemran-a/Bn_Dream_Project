// src/pages/Bot.jsx
import React, { useState, useRef, useEffect } from "react";
import Navbar from "@/components/layout/Navbar"; // استيراد الشريط العلوي

// ✅ 1. تم إلغاء كل منطق وحالات إخفاء الشريط العلوي (Navbar)
// لا يوجد isNavbarVisible أو useEffect الخاص بحركة الماوس

const Bot = () => {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "👋 أهلاً بك! أنا مساعد Binadream الذكي، كيف يمكنني مساعدتك اليوم؟",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8020/ask", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: input } )
      });

      if (!response.ok) throw new Error(`Network response was not ok`);

      const data = await response.json();
      const botMessage = {
        sender: "bot",
        text: data.answer || "❌ لم أتمكن من فهم سؤالك، حاول بصيغة أخرى.",
      };
      setMessages((prev) => [...prev, botMessage]);

    } catch (error) {
      console.error("Fetch error:", error);
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "⚠️ حدث خطأ أثناء الاتصال بالخادم. يرجى المحاولة مرة أخرى.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    // ✅ 2. استخدام نفس هيكل الصفحات العادية
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      
      {/* ✅ 3. حاوية المحتوى الرئيسي مع مسافة علوية (pt-24) لمنع التداخل */}
      <main className="flex-1 container mx-auto px-4 py-8 flex flex-col">
        
        {/* واجهة المحادثة */}
        <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full border rounded-lg shadow-lg overflow-hidden">
          
          {/* منطقة الرسائل */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-muted/20">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-2xl text-sm sm:text-base shadow-md ${
                    msg.sender === "user"
                      ? "bg-primary text-primary-foreground rounded-br-none"
                      : "bg-muted text-foreground rounded-bl-none"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="p-3 bg-muted rounded-2xl rounded-bl-none shadow-md">
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-2 h-2 bg-foreground rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                    <div className="w-2 h-2 bg-foreground rounded-full animate-pulse [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 bg-foreground rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* شريط الإدخال */}
          <div className="p-4 bg-background border-t">
            <form
              onSubmit={sendMessage}
              className="flex items-center gap-3"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="اكتب رسالتك هنا..."
                className="flex-1 p-3 rounded-xl bg-muted border focus:outline-none focus:ring-2 focus:ring-primary text-base"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-primary hover:bg-primary/90 rounded-xl text-primary-foreground font-semibold transition-all shadow-md disabled:opacity-50"
              >
                {loading ? "..." : "إرسال"}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Bot;
