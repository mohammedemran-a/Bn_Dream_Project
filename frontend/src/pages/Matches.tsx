"use client";

import { useEffect, useState } from "react";
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
import { Badge } from "@/components/ui/badge";
import { Trophy, Clock, Calendar, Tv } from "lucide-react";
import { getMatches } from "@/api/football_matches";
import {
  postPrediction,
  getUserPredictions,
  getLeaderboard,
} from "@/api/predictions";

const Matches = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [predictions, setPredictions] = useState({});
  const [userId, setUserId] = useState<number | null>(null);
  const [leaderboard, setLeaderboard] = useState([]);

  // 🧩 تحميل user_id من localStorage
  useEffect(() => {
    const storedUserId = localStorage.getItem("user_id");
    if (storedUserId) setUserId(Number(storedUserId));
  }, []);

  // 🟢 جلب المباريات + توقعات المستخدم + المتصدرين
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getMatches();
        setMatches(response.data);

        // جلب توقعات المستخدم
        if (userId) {
          const userPreds = await getUserPredictions(userId);
          const formatted = {};
          userPreds.data.forEach((p) => {
            formatted[p.football_match_id] = {
              team1: p.team1_score.toString(),
              team2: p.team2_score.toString(),
              submitted: true, // 🔒 تم إرسال التوقع مسبقًا
            };
          });
          setPredictions(formatted);
        }

        // جلب المتصدرين
        const leaders = await getLeaderboard();
        setLeaderboard(leaders.data);
      } catch (error) {
        console.error("❌ خطأ أثناء جلب البيانات:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  // ⚙️ تغيير القيم في التوقعات
  const handlePredictionChange = (matchId, team, value) => {
    if (predictions[matchId]?.submitted) return; // 🔒 لا يمكن التعديل بعد الإرسال

    setPredictions((prev) => ({
      ...prev,
      [matchId]: {
        ...prev[matchId],
        [team]: value,
      },
    }));
  };

  // 🟢 إرسال التوقع
  const handleSubmitPrediction = async (matchId) => {
    if (!userId) {
      alert("الرجاء تسجيل الدخول أولاً");
      return;
    }

    const prediction = predictions[matchId];
    if (prediction?.team1 && prediction?.team2) {
      try {
        await postPrediction({
          user_id: userId,
          football_match_id: matchId,
          team1_score: Number(prediction.team1),
          team2_score: Number(prediction.team2),
        });

        alert("✅ تم إرسال توقعك بنجاح!");
        // 🔒 قفل التوقع بعد الإرسال
        setPredictions((prev) => ({
          ...prev,
          [matchId]: { ...prev[matchId], submitted: true },
        }));
      } catch (error) {
        console.error("❌ خطأ أثناء إرسال التوقع:", error);
        alert(error.response?.data?.message || "حدث خطأ أثناء إرسال التوقع");
      }
    } else {
      alert("⚠️ الرجاء إدخال النتيجة كاملة");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-muted-foreground animate-pulse">
          جاري تحميل المباريات...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="pt-16">
        {/* Page Header */}
        <section className="bg-gradient-to-b from-primary/10 to-background py-20 px-4">
          <div className="container mx-auto text-center space-y-4 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
              <Trophy className="h-5 w-5 text-primary" />
              <span className="font-medium text-primary">توقع واربح</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold">مباريات اليوم</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              توقع نتائج المباريات وشارك في المسابقة للفوز بجوائز قيمة
            </p>
          </div>
        </section>

        {/* Matches Grid */}
        <section className="py-12 px-4">
          <div className="container mx-auto">
            {matches.length === 0 ? (
              <p className="text-center text-muted-foreground">
                لا توجد مباريات حالياً.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {matches.map((match, index) => {
                  const userPred = predictions[match.id] || {};
                  const isSubmitted = userPred.submitted;

                  return (
                    <Card
                      key={match.id}
                      className="hover-lift card-gradient border-2 animate-scale-in"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <CardHeader>
                        <div className="flex items-center justify-between mb-2">
                          <Badge>{match.status || "قادمة"}</Badge>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Tv className="h-4 w-4" />
                            {match.channel || "غير محددة"}
                          </div>
                        </div>

                        <CardTitle className="text-center text-2xl">
                          {match.team1}
                          <span className="text-primary mx-3">VS</span>
                          {match.team2}
                        </CardTitle>

                        <CardDescription className="text-center space-y-1">
                          <div className="flex items-center justify-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>{match.date}</span>
                          </div>
                          <div className="flex items-center justify-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>{match.time}</span>
                          </div>
                        </CardDescription>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        <div className="bg-muted/30 rounded-lg p-4 space-y-3">
                          <h4 className="font-semibold text-center mb-3">
                            توقع النتيجة
                          </h4>

                          <div className="flex items-center gap-3 justify-center">
                            <div className="text-center">
                              <p className="text-sm text-muted-foreground mb-2">
                                {match.team1}
                              </p>
                              <Input
                                type="number"
                                placeholder="0"
                                min="0"
                                className="w-16 text-center text-xl font-bold"
                                value={userPred.team1 || ""}
                                onChange={(e) =>
                                  handlePredictionChange(
                                    match.id,
                                    "team1",
                                    e.target.value
                                  )
                                }
                                disabled={isSubmitted}
                              />
                            </div>

                            <div className="text-2xl font-bold text-primary">
                              -
                            </div>

                            <div className="text-center">
                              <p className="text-sm text-muted-foreground mb-2">
                                {match.team2}
                              </p>
                              <Input
                                type="number"
                                placeholder="0"
                                min="0"
                                className="w-16 text-center text-xl font-bold"
                                value={userPred.team2 || ""}
                                onChange={(e) =>
                                  handlePredictionChange(
                                    match.id,
                                    "team2",
                                    e.target.value
                                  )
                                }
                                disabled={isSubmitted}
                              />
                            </div>
                          </div>

                          <Button
                            className="w-full mt-3 shadow-elegant"
                            onClick={() => handleSubmitPrediction(match.id)}
                            disabled={isSubmitted}
                          >
                            {isSubmitted ? "✅ تم الإرسال" : "إرسال التوقع"}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* 🏆 Leaderboard Section */}
        <section className="py-12 px-4 bg-muted/30">
          <div className="container mx-auto">
            <div className="text-center mb-8 animate-fade-in">
              <h2 className="text-3xl font-bold mb-2">جدول المتصدرين</h2>
              <p className="text-muted-foreground">أفضل المتوقعين</p>
            </div>

            <Card className="max-w-2xl mx-auto card-gradient animate-scale-in">
              <CardContent className="p-6">
                {leaderboard.length === 0 ? (
                  <p className="text-center text-muted-foreground">
                    لا يوجد متصدرين حالياً.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {leaderboard.map((item, index) => (
                      <div
                        key={item.user_id}
                        className="flex items-center justify-between p-4 rounded-lg bg-background/50 hover-lift"
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                              index === 0
                                ? "bg-yellow-500 text-white"
                                : index === 1
                                ? "bg-gray-400 text-white"
                                : index === 2
                                ? "bg-orange-600 text-white"
                                : "bg-muted"
                            }`}
                          >
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-semibold">
                              {item.user?.name || "مستخدم غير معروف"}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              مجموع النقاط: {item.total_points}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Matches;
