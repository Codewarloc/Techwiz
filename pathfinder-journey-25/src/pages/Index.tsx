import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { Stats } from "@/components/Stats";
import { Navigation } from "@/components/Navigation";
const Index = () => {
  return (
    <div className="min-h-screen bg-background">
    
      <main>
        <Hero />
        <Stats />
        <Features />
      </main>
    </div>
  );
};

export default Index;