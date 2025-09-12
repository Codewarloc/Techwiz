import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, FileText, Star, ThumbsUp, ThumbsDown, BarChart } from "lucide-react";
// ✅ Make sure you already have this component

// Content type
interface Content {
  id: number;
  type: "Video" | "Podcast" | "Explainer";
  title: string;
  url: string;
  transcript: string;
  tags: string[];
}

const contentList: Content[] = [
  {
    id: 1,
    type: "Video",
    title: "Career Growth Strategies",
    url: "https://www.youtube.com/embed/a6g8y3EDHkw",
    transcript: "In this video, we explore key strategies for career growth...",
    tags: ["Career", "Beginner"],
  },
  {
    id: 2,
    type: "Podcast",
    title: "Tech Trends 2025",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    transcript: "Welcome to the podcast! Today we discuss upcoming tech trends...",
    tags: ["Technology", "Intermediate"],
  },
  {
    id: 3,
    type: "Explainer",
    title: "How AI is Changing Jobs",
    url: "https://www.youtube.com/embed/2vjPBrBU-TM",
    transcript: "AI is reshaping industries by automating tasks and creating new roles...",
    tags: ["AI", "Advanced"],
  },
];

const MultimediaHub = () => {
  const [selectedContent, setSelectedContent] = useState<Content | null>(contentList[0]);
  const [showTranscript, setShowTranscript] = useState(false);
  const [likes, setLikes] = useState(12);
  const [dislikes, setDislikes] = useState(2);

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden">
      {/* ✅ Navbar */}
   

      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />

      <div className="container relative z-10 px-4 sm:px-6 lg:px-8 mt-20 mb-16">
        {/* 🎬 Main Multimedia Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Play className="w-5 h-5 mr-2 text-primary" />
              Multimedia Learning Hub
            </CardTitle>
          </CardHeader>

          <CardContent>
            {selectedContent && (
              <div className="space-y-6">
                {/* Title */}
                <h2 className="text-2xl font-semibold">{selectedContent.title}</h2>

                {/* ✅ Video / Podcast player */}
                {selectedContent.type === "Video" || selectedContent.type === "Explainer" ? (
                  <iframe
                    width="100%"
                    height="400"
                    src={selectedContent.url}
                    title={selectedContent.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="rounded-lg"
                  ></iframe>
                ) : (
                  <audio controls className="w-full">
                    <source src={selectedContent.url} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                )}

                {/* ✅ Transcript toggle */}
                <div>
                  <Button
                    onClick={() => setShowTranscript(!showTranscript)}
                    variant="outline"
                  >
                    {showTranscript ? "Hide Transcript" : "Show Transcript"}
                  </Button>
                  {showTranscript && (
                    <p className="mt-3 text-gray-600">{selectedContent.transcript}</p>
                  )}
                </div>

                {/* ✅ Like/Dislike + Rating */}
                <div className="flex items-center gap-4">
                  <Button variant="outline" onClick={() => setLikes(likes + 1)}>
                    <ThumbsUp className="w-4 h-4 mr-1" /> {likes}
                  </Button>
                  <Button variant="outline" onClick={() => setDislikes(dislikes + 1)}>
                    <ThumbsDown className="w-4 h-4 mr-1" /> {dislikes}
                  </Button>
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5" /> {/* half rating style */}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 📚 Related Content Section */}
      <div className="container relative z-10 px-4 sm:px-6 lg:px-8 mb-20">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="w-5 h-5 mr-2 text-primary" />
              Related Content
            </CardTitle>
          </CardHeader>

          <CardContent className="grid gap-4 md:grid-cols-3">
            {contentList.map((content) => (
              <div
                key={content.id}
                className={`p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer ${
                  selectedContent?.id === content.id ? "border-2 border-primary" : ""
                }`}
                onClick={() => setSelectedContent(content)}
              >
                <h4 className="font-semibold">{content.title}</h4>
                <p className="text-sm text-muted-foreground">{content.type}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {content.tags.map((tag, idx) => (
                    <Badge key={idx} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* 📊 Feedback & Analytics Section */}
      <div className="container relative z-10 px-4 sm:px-6 lg:px-8 mb-20">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart className="w-5 h-5 mr-2 text-primary" />
              Feedback & Analytics
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-sm text-muted-foreground">
              Track likes, dislikes, and average ratings for your multimedia content here.
            </p>
            <ul className="list-disc list-inside text-sm mt-2">
              <li>Most popular: Career Growth Strategies</li>
              <li>Average Rating: 4.2/5</li>
              <li>Likes vs Dislikes: {likes}:{dislikes}</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default MultimediaHub;
