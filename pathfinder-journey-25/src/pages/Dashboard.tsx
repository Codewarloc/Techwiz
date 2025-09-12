import { useState, useEffect } from "react";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, TrendingUp, Star, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Legend,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";

// ✅ Animated counter hook
const useCountUp = (target: number, duration = 1200) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start: number | null = null;
    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration]);

  return count;
};

// ✅ Simple sentiment analyzer
const analyzeSentiment = (text: string) => {
  const positiveWords = ["good", "great", "excellent", "love", "helpful"];
  const negativeWords = ["bad", "issue", "error", "bug", "problem"];

  const lower = (text || "").toLowerCase();
  if (positiveWords.some((w) => lower.includes(w))) return "positive";
  if (negativeWords.some((w) => lower.includes(w))) return "negative";
  return "neutral";
};

const Dashboard = () => {
  const [username, setUsername] = useState<string>("");
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [trendingCareers, setTrendingCareers] = useState<any[]>([]);
  const [topPicks, setTopPicks] = useState<any[]>([]);
  const [quizResults, setQuizResults] = useState<any[]>([]); // 🔹 quiz results for chart
  const navigate = useNavigate();

  // ✅ Animated values
  const animatedQuizScore = useCountUp(quizScore);
  const animatedBookmarks = useCountUp(bookmarks.length);
  const animatedActivity = useCountUp(recentActivity.length);
  const animatedTopPicks = useCountUp(topPicks.length);

  // ✅ Dynamic chart data
  const [sentimentData, setSentimentData] = useState<any[]>([]);
  const [feedbackTypeData, setFeedbackTypeData] = useState<any[]>([]);
  const [trendData, setTrendData] = useState<any[]>([]);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const userRes = await api.get("auth/me/");
        setUsername(userRes.data.uname || userRes.data.username || "Guest");

        const activityRes = await api.get(
          "feedback/?user=" + userRes.data.user_id
        );

        // add sentiment if missing
        const enriched = activityRes.data.map((a: any) => ({
          ...a,
          sentiment: a.sentiment || analyzeSentiment(a.message || a.status),
        }));

        setRecentActivity(enriched);

        const quizRes = await api.get("profiles/" + userRes.data.user_id + "/");
        setQuizScore(quizRes.data.quiz_score || 0);

        const bookmarksRes = await api.get(
          "bookmarks/?user=" + userRes.data.user_id
        );
        setBookmarks(bookmarksRes.data);

        const recRes = await api.get(
          "careers/?recommended=true&user=" + userRes.data.user_id
        );
        setRecommendations(recRes.data);

        const trendingRes = await api.get("careers/?trending=true");
        setTrendingCareers(trendingRes.data);

        const picksRes = await api.get(
          "careers/?top_picks=true&user=" + userRes.data.user_id
        );
        setTopPicks(picksRes.data);

        // 🔹 Fetch quiz results for chart
        const quizResultsRes = await api.get("quizresults/");
        setQuizResults(quizResultsRes.data);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      }
    };
    fetchDashboard();
  }, []);

  // ✅ Setup charts once feedback is loaded
  useEffect(() => {
    const updateCharts = () => {
      setSentimentData([
        {
          name: "Positive",
          value: recentActivity.filter((f) => f.sentiment === "positive").length,
        },
        {
          name: "Negative",
          value: recentActivity.filter((f) => f.sentiment === "negative").length,
        },
        {
          name: "Neutral",
          value: recentActivity.filter((f) => f.sentiment === "neutral").length,
        },
      ]);

      setFeedbackTypeData([
        {
          type: "Suggestions",
          count: recentActivity.filter((f) => f.type === "suggestion").length,
        },
        {
          type: "Bugs",
          count: recentActivity.filter((f) => f.type === "bug").length,
        },
        {
          type: "Other",
          count: recentActivity.filter(
            (f) => f.type !== "suggestion" && f.type !== "bug"
          ).length,
        },
      ]);

      // 🔹 Simulated crypto-style activity trend
      setTrendData((prev) => {
        const nextValue =
          (recentActivity.length || 1) * (Math.random() * 10 + 5);
        return [
          ...prev.slice(-9),
          { day: `Day ${prev.length + 1}`, activity: nextValue },
        ];
      });
    };

    updateCharts();
    const interval = setInterval(updateCharts, 5000); // refresh every 5s
    return () => clearInterval(interval);
  }, [recentActivity]);

  useEffect(() => {
    const token = localStorage.getItem("access");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {username}! 👋
          </h1>
          <p className="text-muted-foreground">
            Continue your career exploration journey
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-primary font-medium">Quiz Score</p>
                <p className="text-2xl font-bold text-foreground">
                  {animatedQuizScore}%
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-primary" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-secondary font-medium">Bookmarks</p>
                <p className="text-2xl font-bold text-foreground">
                  {animatedBookmarks}
                </p>
              </div>
              <Star className="w-8 h-8 text-secondary" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-primary font-medium">Recent Activity</p>
                <p className="text-2xl font-bold text-foreground">
                  {animatedActivity}
                </p>
              </div>
              <Users className="w-8 h-8 text-primary" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-secondary font-medium">Top Picks</p>
                <p className="text-2xl font-bold text-foreground">
                  {animatedTopPicks}
                </p>
              </div>
              <BookOpen className="w-8 h-8 text-secondary" />
            </CardContent>
          </Card>
        </div>

        {/* Widgets */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left side: Recommendations + Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* 🔹 Quiz Results Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Quiz Results Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                {quizResults.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={quizResults}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="submitted_at" />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="scores.Tech"
                        stroke="#8884d8"
                        name="Tech"
                      />
                      <Line
                        type="monotone"
                        dataKey="scores.Creative"
                        stroke="#82ca9d"
                        name="Creative"
                      />
                      <Line
                        type="monotone"
                        dataKey="scores.Analytical"
                        stroke="#ffc658"
                        name="Analytical"
                      />
                      <Line
                        type="monotone"
                        dataKey="scores.Leadership"
                        stroke="#ff7300"
                        name="Leadership"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <p>No quiz results yet.</p>
                )}
              </CardContent>
            </Card>

            {/* Recommended Careers */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-primary" />
                  Recommended Careers
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recommendations.map((career: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div>
                      <h4 className="font-semibold">{career.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {career.domain}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">
                        {career.match_percent || "Match"} match
                      </Badge>
                      <Button size="sm">View</Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recommended Content */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="w-5 h-5 mr-2 text-secondary" />
                  Recommended Content & Videos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                  <div>
                    <h4 className="font-semibold">How to Ace Your Interview</h4>
                    <p className="text-sm text-muted-foreground">Video</p>
                  </div>
                  <Button size="sm">Watch</Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar Widgets */}
          <div className="space-y-6">
            {/* Trending Careers */}
            <Card>
              <CardHeader>
                <CardTitle>Trending Careers</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {trendingCareers.map((career: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between">
                    <span>{career.title}</span>
                    <Badge variant="outline">{career.domain}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Top Picks */}
            <Card>
              <CardHeader>
                <CardTitle>Top Picks for You</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {topPicks.map((career: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between">
                    <span>{career.title}</span>
                    <Badge variant="outline">{career.domain}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* ✅ Feedback Analytics with Live Charts */}
            <Card>
              <CardHeader>
                <CardTitle>Feedback Analytics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Sentiment Pie Chart */}
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={sentimentData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label
                        dataKey="value"
                      >
                        <Cell fill="#4ade80" /> {/* Green */}
                        <Cell fill="#f87171" /> {/* Red */}
                        <Cell fill="#a3a3a3" /> {/* Gray */}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Feedback Type Bar Chart */}
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={feedbackTypeData}>
                      <XAxis dataKey="type" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar
                        dataKey="count"
                        fill="#6366f1"
                        radius={[8, 8, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Crypto-style Line Chart */}
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trendData}>
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="activity"
                        stroke="#f59e0b"
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentActivity.map((activity: any, idx: number) => (
                  <div key={idx} className="text-sm">
                    <p className="font-medium">
                      {activity.category || "Activity"} —{" "}
                      <span
                        className={`${
                          activity.sentiment === "positive"
                            ? "text-green-500"
                            : activity.sentiment === "negative"
                            ? "text-red-500"
                            : "text-gray-500"
                        }`}
                      >
                        {activity.sentiment}
                      </span>
                    </p>
                    <p className="text-muted-foreground">
                      {activity.message || activity.status}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
