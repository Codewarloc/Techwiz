import { useState } from "react";
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
} from "lucide-react";
import { Link } from "react-router-dom";
import api from "@/lib/api";
import { toast } from "@/components/ui/sonner";

export const Hero = () => {
  const [feedback, setFeedback] = useState("");
  const [type, setType] = useState("suggestion");
  const [loading, setLoading] = useState(false);

  const resources = [
    { id: 1, title: "Beginner’s Guide to Careers", tag: "Beginner", type: "PDF" },
    { id: 2, title: "Scholarship Checklist", tag: "Scholarship", type: "Checklist" },
    { id: 3, title: "Top 10 Skills Infographic", tag: "Skill-Building", type: "Infographic" },
  ];

  const handleSubmitFeedback = async () => {
    if (!feedback.trim()) {
      toast.error("⚠️ Please enter some feedback before submitting.");
      return;
    }

    setLoading(true);
    try {
      // ✅ Fixed field names to match Django backend
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
      {/* Hero Section */}
      <div className="relative flex-grow flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "2s" }}
        />

        <div className="container relative z-10 px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-5xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-primary/10 backdrop-blur-sm border border-primary/20 rounded-full px-6 py-3 mb-8 animate-fade-in-scale">
              <Sparkles className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-primary">
                Discover Your Perfect Career Path
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-6 animate-slide-in-up">
              <span className="text-foreground">Find What</span>
              <br />
              <span className="text-gradient">Fits You Best</span>
            </h1>

            {/* Subtitle */}
            <p
              className="text-xl sm:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto animate-slide-in-up"
              style={{ animationDelay: "0.2s" }}
            >
              PathSeeker guides students, graduates, and professionals through
              personalized career exploration with AI-powered recommendations and
              expert insights.
            </p>

            {/* CTA Buttons */}
            <div
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-slide-in-up"
              style={{ animationDelay: "0.4s" }}
            >
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

            {/* Feature Icons */}
            <div
              className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto animate-slide-in-up"
              style={{ animationDelay: "0.6s" }}
            >
              <div className="flex flex-col items-center space-y-3 p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 hover:scale-105 transition-transform duration-300">
                <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground">Personalized Matching</h3>
                <p className="text-sm text-muted-foreground text-center">
                  AI-powered career recommendations based on your skills and interests
                </p>
              </div>

              <div className="flex flex-col items-center space-y-3 p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 hover:scale-105 transition-transform duration-300">
                <div className="w-12 h-12 bg-secondary/20 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-secondary" />
                </div>
                <h3 className="font-semibold text-foreground">Expert Guidance</h3>
                <p className="text-sm text-muted-foreground text-center">
                  Learn from industry professionals and success stories
                </p>
              </div>

              <div className="flex flex-col items-center space-y-3 p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 hover:scale-105 transition-transform duration-300">
                <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground">Interactive Tools</h3>
                <p className="text-sm text-muted-foreground text-center">
                  Quizzes, assessments, and multimedia learning resources
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 📘 Document Resource Library Section */}
      <div className="container relative z-10 px-4 sm:px-6 lg:px-8 mt-20 mb-16">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="w-5 h-5 mr-2 text-primary" />
              Document Resource Library
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            {resources.map((res) => (
              <div
                key={res.id}
                className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <h4 className="font-semibold">{res.title}</h4>
                <p className="text-sm text-muted-foreground">{res.type}</p>
                <Badge className="mt-2" variant="secondary">
                  {res.tag}
                </Badge>
                <div className="mt-3">
                  <Button size="sm" variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* 📤 Feedback Form Section */}
      <div className="container relative z-10 px-4 sm:px-6 lg:px-8 mb-20 max-w-xl mx-auto">
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
                className="w-full border border-border rounded-md px-3 py-2 mt-1 text-sm"
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
    </section>
  );
};

export default Hero;
