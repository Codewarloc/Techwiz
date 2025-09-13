import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowRight,
  Sparkles,
  Target,
  Users,
  FileText,
  Download,
  Star,
} from "lucide-react";
import { Link } from "react-router-dom";
import api from "@/lib/api";
import { toast } from "@/components/ui/sonner";

export const Hero = () => {
  const [feedback, setFeedback] = useState("");
  const [type, setType] = useState("suggestion");
  const [loading, setLoading] = useState(false);

  // Bookmarks state
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [noteInput, setNoteInput] = useState<{ [key: number]: string }>({});

  const resources = [
    {
      id: 1,
      title: "Beginner’s Guide to Careers",
      tag: "Beginner",
      type: "PDF",
      url: "/files/guide.pdf",
    },
    {
      id: 2,
      title: "Scholarship Checklist",
      tag: "Scholarship",
      type: "Checklist",
      url: "/files/checklist.pdf",
    },
    {
      id: 3,
      title: "Top 10 Skills Infographic",
      tag: "Skill-Building",
      type: "Infographic",
      url: "/files/skills.pdf",
    },
  ];

  // Fetch bookmarks on load
  useEffect(() => {
    api
      .get("bookmarks/")
      .then((res) => setBookmarks(res.data))
      .catch(() => {});
  }, []);

  const handleBookmark = async (res: any) => {
    try {
      const note = noteInput[res.id] || "";
      const response = await api.post("bookmarks/", {
        resource: res.id,
        note,
      });
      setBookmarks([...bookmarks, response.data]);
      toast.success("🔖 Resource bookmarked!");
    } catch (err) {
      console.error("Bookmark error:", err);
      toast.error("❌ Failed to bookmark resource.");
    }
  };

  const handleExportPDF = () => {
    window.open(api.defaults.baseURL + "bookmarks/export_pdf/", "_blank");
  };

  const handleSubmitFeedback = async () => {
    if (!feedback.trim()) {
      toast.error("⚠️ Please enter some feedback before submitting.");
      return;
    }

    setLoading(true);
    try {
      await api.post("feedback/", { category: type, message: feedback });
      toast.success("✅ Feedback submitted successfully!");
      setFeedback("");
      setType("suggestion");
    } catch (err) {
      console.error("Feedback submission error:", err);
      toast.error("❌ Failed to submit feedback. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden">
      {/* Floating Background Circles */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-float-fast" />
      </div>

      {/* Hero Content */}
      <div className="container relative z-10 px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <div className="inline-flex items-center space-x-2 bg-primary/10 backdrop-blur-sm border border-primary/20 rounded-full px-6 py-3 mb-8 animate-fade-up delay-100">
          <Sparkles className="w-5 h-5 text-primary" />
          <span className="text-sm font-medium text-primary">
            Discover Your Perfect Career Path
          </span>
        </div>

        {/* Heading */}
        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-6 animate-fade-up delay-200">
          <span className="text-foreground">Find What</span>
          <br />
          <span className="text-gradient">Fits You Best</span>
        </h1>

        {/* Subtitle */}
        <p className="text-xl sm:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto animate-fade-up delay-300">
          PathSeeker guides students, graduates, and professionals through
          personalized career exploration with AI-powered recommendations and
          expert insights.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-up delay-400">
          <Link to="/register">
            <Button size="lg" className="btn-hero text-lg px-8 py-4">
              Start Your Journey
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
          <Link to="/quiz">
            <Button size="lg" variant="outline" className="text-lg px-8 py-4">
              Take Quiz
            </Button>
          </Link>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto animate-fade-up delay-500">
          {[
            {
              icon: Target,
              title: "Personalized Matching",
              desc: "AI-powered career recommendations based on your skills and interests",
              color: "primary/20",
            },
            {
              icon: Users,
              title: "Expert Guidance",
              desc: "Learn from industry professionals and success stories",
              color: "secondary/20",
            },
            {
              icon: Sparkles,
              title: "Interactive Tools",
              desc: "Quizzes, assessments, and multimedia learning resources",
              color: "primary/20",
            },
          ].map((feat, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center space-y-3 p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 hover:scale-105 transition-transform duration-300"
            >
              <div
                className={`w-12 h-12 bg-${feat.color} rounded-xl flex items-center justify-center`}
              >
                <feat.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground">{feat.title}</h3>
              <p className="text-sm text-muted-foreground text-center">
                {feat.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Resource Library */}
        <div className="mt-20 mb-16 animate-fade-up delay-600">
          <Card>
            <CardHeader className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2 text-primary" />
                Document Resource Library
              </CardTitle>
              <Button onClick={handleExportPDF} variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" /> Export Bookmarks
              </Button>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-3">
              {resources.map((res) => (
                <div
                  key={res.id}
                  className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors space-y-2"
                >
                  <h4 className="font-semibold">{res.title}</h4>
                  <p className="text-sm text-muted-foreground">{res.type}</p>
                  <Badge className="mt-2" variant="secondary">
                    {res.tag}
                  </Badge>

                  {/* Sticky note input */}
                  <Textarea
                    placeholder="Add a quick note..."
                    value={noteInput[res.id] || ""}
                    onChange={(e) =>
                      setNoteInput({ ...noteInput, [res.id]: e.target.value })
                    }
                    className="mt-2 text-sm"
                  />

                  <div className="flex gap-2 mt-3">
                    <a href={res.url} download>
                      <Button size="sm" variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </a>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleBookmark(res)}
                    >
                      <Star className="w-4 h-4 mr-2" />
                      Bookmark
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Feedback Form */}
        <div className="mb-20 max-w-xl mx-auto animate-fade-up delay-700">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Sparkles className="w-5 h-5 mr-2 text-primary" />
                Send Feedback
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Feedback Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 text-sm"
                >
                  <option value="bug">Bug</option>
                  <option value="suggestion">Suggestion</option>
                  <option value="query">Query</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium">Your Feedback</label>
                <Textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Share your thoughts..."
                  className="mt-1"
                />
              </div>

              <Button
                className="w-full"
                onClick={handleSubmitFeedback}
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit Feedback"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Hero;
