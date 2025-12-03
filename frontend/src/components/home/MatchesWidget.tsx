import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Trophy, Calendar, Clock } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMatches, Match as API_Match } from "@/api/football_matches";
import { getUserPredictions, postPrediction } from "@/api/predictions";
import { useAuthStore } from "@/store/useAuthStore";
import { BASE_URL } from "@/api/axios"; // ✅ لجلب الشعارات

export type Prediction = {
  match_id: number;
  team1: number;
  team2: number;
  submitted: boolean;
};

const MatchesWidget = () => {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const userId = user?.id ?? null;

  const [predictions, setPredictions] = useState<Record<number, Prediction>>({});

  // 🟢 جلب المباريات
  const { data: todayMatches = [], isLoading, isError } = useQuery<API_Match[]>({
    queryKey: ["matches"],
    queryFn: getMatches,
  });

  // 🟢 جلب توقعات المستخدم
  const { data: userPredictions = [] } = useQuery({
    queryKey: ["userPredictions", userId],
    queryFn: () => (userId ? getUserPredictions(userId) : []),
    enabled: !!userId,
  });

  // 🟢 مزامنة التوقعات مع السيرفر
  useEffect(() => {
    if (!userPredictions) return;

    const initialPredictions: Record<number, Prediction> = {};
    userPredictions.forEach((p) => {
      initialPredictions[p.football_match_id] = {
        match_id: p.football_match_id,
        team1: p.team1_score,
        team2: p.team2_score,
        submitted: true,
      };
    });

    setPredictions((prev) => {
      const prevKeys = Object.keys(prev);
      const newKeys = Object.keys(initialPredictions);

      if (
        prevKeys.length === newKeys.length &&
        prevKeys.every(
          (k) =>
            prev[k]?.submitted === initialPredictions[k]?.submitted &&
            prev[k]?.team1 === initialPredictions[k]?.team1 &&
            prev[k]?.team2 === initialPredictions[k]?.team2
        )
      ) {
        return prev;
      }

      return initialPredictions;
    });
  }, [userPredictions]);

  // 🟢 إرسال التوقع
  const predictionMutation = useMutation({
    mutationFn: (data: { matchId: number; team1: number; team2: number }) =>
      postPrediction({
        user_id: userId!,
        match_id: data.matchId,
        team1: data.team1,
        team2: data.team2,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userPredictions", userId] });
    },
  });

  // ⚙️ تعديل التوقع
  const handlePredictionChange = (
    matchId: number,
    team: "team1" | "team2",
    value: string
  ) => {
    const currentPrediction: Prediction = predictions[matchId] ?? {
      match_id: matchId,
      team1: 0,
      team2: 0,
      submitted: false,
    };

    if (currentPrediction.submitted) return;

    setPredictions({
      ...predictions,
      [matchId]: { ...currentPrediction, [team]: Number(value) },
    });
  };

  // ⚙️ إرسال التوقع
  const handleSubmitPrediction = (matchId: number) => {
    if (!userId) return alert("🚫 يجب تسجيل الدخول أولاً");

    const prediction = predictions[matchId];
    if (!prediction) return alert("❌ لم يتم إدخال أي توقع");

    if (prediction.submitted) return alert(" لقد تم إرسال هذا التوقع مسبقًا");

    if (!prediction.team1 && !prediction.team2)
      return alert("❌ الرجاء إدخال التوقعين");

    predictionMutation.mutate({
      matchId,
      team1: prediction.team1,
      team2: prediction.team2,
    });

    setPredictions({
      ...predictions,
      [matchId]: { ...prediction, submitted: true },
    });
  };

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 space-y-4 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
            <Trophy className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              مباريات اليوم
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold">شارك بتوقعاتك</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            توقع نتائج المباريات واربح جوائز قيمة
          </p>
        </div>

        {/* Matches Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {isLoading && (
            <p className="text-center col-span-3">جارٍ تحميل المباريات...</p>
          )}
          {isError && (
            <p className="text-center col-span-3 text-red-500">
              حدث خطأ أثناء جلب المباريات.
            </p>
          )}

          {!isLoading &&
            !isError &&
            todayMatches.slice(0, 3).map((match, index) => {
              const prediction: Prediction = predictions[match.id!] ?? {
                match_id: match.id!,
                team1: 0,
                team2: 0,
                submitted: false,
              };

              const isSubmitted = prediction.submitted;

              return (
                <Card
                  key={match.id}
                  className="hover-lift card-gradient border-2 animate-scale-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardHeader>
                    <Badge className="w-fit">
                      {match.status || "قادمة"}
                    </Badge>

                    {/* ✅ عرض الشعارات + أسماء الفرق */}
                    <CardTitle className="text-center text-xl mt-4 flex items-center justify-center gap-3">
                      <div className="text-center">
                        {match.team1_logo && (
                          <img
                            src={`${BASE_URL}/storage/${match.team1_logo}`}
                            alt={match.team1}
                            className="w-10 h-10 object-cover rounded-full mx-auto mb-1"
                          />
                        )}
                        <span>{match.team1}</span>
                      </div>

                      <span className="text-primary mx-3">VS</span>

                      <div className="text-center">
                        {match.team2_logo && (
                          <img
                            src={`${BASE_URL}/storage/${match.team2_logo}`}
                            alt={match.team2}
                            className="w-10 h-10 object-cover rounded-full mx-auto mb-1"
                          />
                        )}
                        <span>{match.team2}</span>
                      </div>
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{match.time}</span>
                    </div>

                    <div className="flex items-center justify-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{match.channel}</span>
                    </div>

                    {/* Prediction Inputs */}
                    <div className="flex items-center gap-2 justify-center mt-3">
                      <input
                        type="number"
                        className="w-16 text-center text-xl font-bold border rounded-md"
                        value={prediction.team1}
                        min={0}
                        disabled={isSubmitted}
                        onChange={(e) =>
                          handlePredictionChange(
                            match.id!,
                            "team1",
                            e.target.value
                          )
                        }
                      />
                      <span className="text-2xl font-bold text-primary">-</span>
                      <input
                        type="number"
                        className="w-16 text-center text-xl font-bold border rounded-md"
                        value={prediction.team2}
                        min={0}
                        disabled={isSubmitted}
                        onChange={(e) =>
                          handlePredictionChange(
                            match.id!,
                            "team2",
                            e.target.value
                          )
                        }
                      />
                    </div>

                    {/* Submit Button */}
                    <Button
                      className="w-full mt-4"
                      onClick={() => handleSubmitPrediction(match.id!)}
                      disabled={isSubmitted || predictionMutation.isPending}
                    >
                      {isSubmitted ? "تم الإرسال" : "إرسال التوقع"}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
        </div>

        {/* View All Button */}
        <div
          className="text-center animate-fade-in"
          style={{ animationDelay: "0.4s" }}
        >
          <Link to="/matches">
            <Button size="lg" className="shadow-elegant">
              <Trophy className="h-5 w-5 ml-2" />
              عرض جميع المباريات
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default MatchesWidget;
