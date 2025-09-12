import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Brain, TrendingUp, Users, Star, Download } from "lucide-react";

export const Features = () => {
  const features = [
    {
      icon: <Brain className="w-8 h-8 text-primary" />,
      title: "AI-Powered Quiz",
      description: "Take our intelligent assessment to discover careers that match your personality and interests",
      gradient: "from-primary/20 to-primary/5"
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-secondary" />,
      title: "Career Bank",
      description: "Explore thousands of career paths with detailed information about roles, salaries, and growth prospects",
      gradient: "from-secondary/20 to-secondary/5"
    },
    {
      icon: <BookOpen className="w-8 h-8 text-primary" />,
      title: "Learning Resources", 
      description: "Access curated content, videos, and downloadable guides for your career development",
      gradient: "from-primary/20 to-primary/5"
    },
    {
      icon: <Users className="w-8 h-8 text-secondary" />,
      title: "Success Stories",
      description: "Get inspired by real professionals who've built successful careers in their fields",
      gradient: "from-secondary/20 to-secondary/5"
    },
    {
      icon: <Star className="w-8 h-8 text-primary" />,
      title: "Personal Dashboard",
      description: "Track your progress, save favorites, and get personalized recommendations",
      gradient: "from-primary/20 to-primary/5"
    },
    {
      icon: <Download className="w-8 h-8 text-secondary" />,
      title: "Resource Library",
      description: "Download career guides, templates, and tools to accelerate your professional journey",
      gradient: "from-secondary/20 to-secondary/5"
    }
  ];

  return (
    <section id="features" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            <span className="text-gradient">Everything You Need</span>
            <br />
            <span className="text-foreground">For Career Success</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Comprehensive tools and resources to guide you from exploration to achievement
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="group hover:shadow-xl transition-all duration-300 hover:scale-105 border-0 bg-card/50 backdrop-blur-sm overflow-hidden"
            >
              <CardContent className="p-8">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-foreground group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};