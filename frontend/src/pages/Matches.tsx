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

const Matches = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [predictions, setPredictions] = useState<{
    [key: number]: { team1: string; team2: string };
  }>({});

  // 🟢 جلب المباريات من الـ API عند تحميل الصفحة
  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await getMatches();
        setMatches(response.data);
      } catch (error) {
        console.error("❌ خطأ أثناء جلب المباريات:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  const handlePredictionChange = (
    matchId: number,
    team: "team1" | "team2",
    value: string
  ) => {
    setPredictions((prev) => ({
      ...prev,
      [matchId]: {
        ...prev[matchId],
        [team]: value,
      },
    }));
  };

  const handleSubmitPrediction = (matchId: number) => {
    const prediction = predictions[matchId];
    if (prediction?.team1 && prediction?.team2) {
      console.log(`Prediction for match ${matchId}:`, prediction);
      alert("تم إرسال توقعك بنجاح!");
    } else {
      alert("الرجاء إدخال النتيجة كاملة");
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
                {matches.map((match, index) => (
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
                              value={predictions[match.id]?.team1 || ""}
                              onChange={(e) =>
                                handlePredictionChange(
                                  match.id,
                                  "team1",
                                  e.target.value
                                )
                              }
                            />
                          </div>

                          <div className="text-2xl font-bold text-primary">-</div>

                          <div className="text-center">
                            <p className="text-sm text-muted-foreground mb-2">
                              {match.team2}
                            </p>
                            <Input
                              type="number"
                              placeholder="0"
                              min="0"
                              className="w-16 text-center text-xl font-bold"
                              value={predictions[match.id]?.team2 || ""}
                              onChange={(e) =>
                                handlePredictionChange(
                                  match.id,
                                  "team2",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                        </div>

                        <Button
                          className="w-full mt-3 shadow-elegant"
                          onClick={() => handleSubmitPrediction(match.id)}
                        >
                          إرسال التوقع
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Leaderboard Section */}
        <section className="py-12 px-4 bg-muted/30">
          <div className="container mx-auto">
            <div className="text-center mb-8 animate-fade-in">
              <h2 className="text-3xl font-bold mb-2">جدول المتصدرين</h2>
              <p className="text-muted-foreground">أفضل المتوقعين هذا الأسبوع</p>
            </div>

            <Card className="max-w-2xl mx-auto card-gradient animate-scale-in">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((rank) => (
                    <div
                      key={rank}
                      className="flex items-center justify-between p-4 rounded-lg bg-background/50 hover-lift"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                            rank === 1
                              ? "bg-yellow-500 text-white"
                              : rank === 2
                              ? "bg-gray-400 text-white"
                              : rank === 3
                              ? "bg-orange-600 text-white"
                              : "bg-muted"
                          }`}
                        >
                          {rank}
                        </div>
                        <div>
                          <p className="font-semibold">متوقع {rank}</p>
                          <p className="text-sm text-muted-foreground">
                            عضو منذ 2024
                          </p>
                        </div>
                      </div>

                      <div className="text-left">
                        <p className="font-bold text-primary">{15 - rank} نقطة</p>
                        <p className="text-sm text-muted-foreground">
                          {20 - rank} توقع صحيح
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
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
