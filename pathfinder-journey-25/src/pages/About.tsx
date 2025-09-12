import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

import { BookOpen, Users, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

// ✅ Mock success stories data
const initialStories = [
  {
    id: 1,
    name: "Odekunle Aanuoluwapo",
    domain: "Sports",
    education: "Trained at a local football academy",
    challenge:
      "Faced limited opportunities and lack of sponsorship while pursuing a professional career.",
    outcome:
      "Became a professional footballer, playing for both club and representing his country at international tournaments.",
  },
  {
    id: 2,
    name: "David Lee",
    domain: "Medicine",
    education: "M.D. in Pediatrics",
    challenge: "Balancing medical school with financial challenges.",
    outcome: "Now runs a children’s clinic serving underserved areas.",
  },
  {
    id: 3,
    name: "Ojure Mayowa",
    domain: "Sports",
    education: "Rose through grassroots football tournaments and local leagues",
    challenge:
      "Overcame multiple injuries and lack of training facilities while chasing his football dreams.",
    outcome:
      "Signed by a professional football club and became a role model for aspiring young athletes in his community.",
  },
  {
    id: 4,
    name: "Lesley Nkwocha",
    domain: "Technology",
    education: "B.Sc in Information Technology",
    challenge: "Low attention span.",
    outcome: "Now works at Spotify.",
  },
  {
    id: 5,
    name: "Odafe Akoreha",
    domain: "Game Development",
    education: "Middlesex Graduate",
    challenge: "Lack of resources and tools.",
    outcome: "Now works as a Game Developer at FromSoftware.",
  },
  {
    id: 6,
    name: "James Itam",
    domain: "Technology",
    education: "Studied Computer Science at University",
    challenge:
      "Struggled with balancing academics and learning real-world software development skills.",
    outcome:
      "Became a software developer specializing in full-stack web applications and contributed to impactful open-source projects.",
  },
];

const domains = ["All", "Technology", "Medicine", "Business", "Sports", "Game Development"];

// ✅ Timeline Component
const Timeline = ({ education, challenge, outcome }: any) => {
  const steps = [
    { label: "Education", content: education, icon: "🎓", color: "text-blue-600" },
    { label: "Challenge", content: challenge, icon: "⚡", color: "text-yellow-600" },
    { label: "Outcome", content: outcome, icon: "🏆", color: "text-green-600" },
  ];

  return (
    <ol className="relative border-l border-muted-foreground/30 pl-4 space-y-6">
      {steps.map((step, index) => (
        <li key={index} className="ml-2">
          <span
            className={`absolute -left-4 flex h-8 w-8 items-center justify-center rounded-full bg-muted ${step.color}`}
          >
            {step.icon}
          </span>
          <h4 className="font-semibold">{step.label}</h4>
          <p className="text-sm text-muted-foreground">{step.content}</p>
        </li>
      ))}
    </ol>
  );
};

const About = () => {
  const [stories, setStories] = useState(initialStories);
  const [filter, setFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [newStory, setNewStory] = useState({
    name: "",
    domain: "",
    education: "",
    challenge: "",
    outcome: "",
  });

  const filteredStories =
    filter === "All"
      ? stories
      : stories.filter((story) => story.domain === filter);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry = {
      id: stories.length + 1,
      ...newStory,
    };
    setStories([...stories, newEntry]);
    setNewStory({ name: "", domain: "", education: "", challenge: "", outcome: "" });
    setShowForm(false);
  };

  return (
    <section className="relative flex flex-col overflow-hidden">
      {/* Navbar */}
     

      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5 -z-10" />

      {/* Landing / Hero Section */}
      <div className="container relative z-10 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-center min-h-[60vh] py-20">
        <h1 className="text-5xl sm:text-6xl font-bold mb-6 text-foreground">PathSeeker</h1>
        <p className="text-lg sm:text-2xl text-muted-foreground max-w-3xl mb-8">
          Navigate your career journey with confidence. Explore opportunities, learn from experts, and track your progress with PathSeeker’s interactive Career Passport.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button onClick={() => window.scrollTo({ top: 600, behavior: "smooth" })} size="lg">
            Learn More
          </Button>
          <Button onClick={() => window.scrollTo({ top: 600, behavior: "smooth" })} variant="outline" size="lg">
            Explore Stories
          </Button>
        </div>
      </div>

      {/* About Section */}
      <div className="container relative z-10 px-4 sm:px-6 lg:px-8 py-12 max-w-6xl mx-auto space-y-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-primary/10 backdrop-blur-sm border border-primary/20 rounded-full px-6 py-3 mb-6">
            <BookOpen className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-primary">About Us</span>
          </div>

          <h2 className="text-3xl font-bold mb-4">Why PathSeeker?</h2>
          <p className="text-muted-foreground mb-4">
            PathSeeker is a full-stack web application designed to empower students, graduates, and professionals to make informed career decisions. It offers personalized quizzes, a global career database, and an interactive dashboard for tracking progress.
          </p>
          <p className="text-muted-foreground">
            Built with scalable, modern technologies, PathSeeker is suitable for personal use, institutions, and career fairs. Administrators have full control over user management and content, making it a versatile career guidance platform.
          </p>
        </div>

        {/* Filtering Section */}
        <div className="flex justify-center space-x-4 mb-10">
          {domains.map((d) => (
            <Button
              key={d}
              onClick={() => setFilter(d)}
              variant={filter === d ? "default" : "outline"}
            >
              {d}
            </Button>
          ))}
        </div>

        {/* Stories Grid with Timeline */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredStories.map((story) => (
            <Card key={story.id} className="shadow-md hover:shadow-lg transition-all">
              <CardContent className="p-6 space-y-4">
                <h2 className="text-xl font-semibold text-primary">{story.name}</h2>
                <p className="text-sm text-muted-foreground">
                  <strong>Domain:</strong> {story.domain}
                </p>
                <Timeline
                  education={story.education}
                  challenge={story.challenge}
                  outcome={story.outcome}
                />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Submit Story Section */}
        <div className="text-center mt-12">
          {!showForm ? (
            <Button variant="outline" onClick={() => setShowForm(true)}>
              Share Your Story
            </Button>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="max-w-lg mx-auto space-y-4 p-6 border rounded-lg shadow-md bg-background"
            >
              <Input
                placeholder="Your Name"
                value={newStory.name}
                onChange={(e) =>
                  setNewStory({ ...newStory, name: e.target.value })
                }
                required
              />

              <Select
                onValueChange={(value) =>
                  setNewStory({ ...newStory, domain: value })
                }
                value={newStory.domain}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Domain" />
                </SelectTrigger>
                <SelectContent>
                  {domains.filter((d) => d !== "All").map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Textarea
                placeholder="Education"
                value={newStory.education}
                onChange={(e) =>
                  setNewStory({ ...newStory, education: e.target.value })
                }
                required
              />
              <Textarea
                placeholder="Challenge"
                value={newStory.challenge}
                onChange={(e) =>
                  setNewStory({ ...newStory, challenge: e.target.value })
                }
                required
              />
              <Textarea
                placeholder="Outcome"
                value={newStory.outcome}
                onChange={(e) =>
                  setNewStory({ ...newStory, outcome: e.target.value })
                }
                required
              />
              <div className="flex space-x-4">
                <Button type="submit">Add Story</Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default About;
