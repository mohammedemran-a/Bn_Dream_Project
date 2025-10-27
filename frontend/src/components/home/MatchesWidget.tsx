import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Trophy, Calendar, Clock } from "lucide-react";

const todayMatches = [
  {
    id: 1,
    team1: "ريال مدريد",
    team2: "برشلونة",
    time: "20:00",
    channel: "beIN Sports",
    status: "قريباً",
  },
  {
    id: 2,
    team1: "ليفربول",
    team2: "مانشستر سيتي",
    time: "22:00",
    channel: "beIN Sports",
    status: "قريباً",
  },
  {
    id: 3,
    team1: "بايرن ميونخ",
    team2: "بوروسيا دورتموند",
    time: "21:30",
    channel: "beIN Sports",
    status: "قريباً",
  },
];

const MatchesWidget = () => {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 space-y-4 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
            <Trophy className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">مباريات اليوم</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold">شارك بتوقعاتك</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            توقع نتائج المباريات واربح جوائز قيمة
          </p>
        </div>

        {/* Matches Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {todayMatches.map((match, index) => (
            <Card
              key={match.id}
              className="hover-lift card-gradient border-2 animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader>
                <Badge className="w-fit">{match.status}</Badge>
                <CardTitle className="text-center text-xl mt-4">
                  {match.team1} <span className="text-primary mx-2">VS</span> {match.team2}
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
                <Button className="w-full mt-4" variant="outline">
                  توقع النتيجة
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center animate-fade-in" style={{ animationDelay: "0.4s" }}>
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
