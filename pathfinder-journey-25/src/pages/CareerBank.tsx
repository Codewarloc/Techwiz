import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Star, TrendingUp, Users, DollarSign, Loader2 } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import api from "@/lib/api"; // Import your configured API instance
import { toast } from "@/components/ui/use-toast";

// Define the type for a career object from the backend
interface Career {
  career_id: number;
  title: string;
  description: string;
  domain: string;
  required_skills: string[];
  education_path: string;
  expected_salary: string;
  company: string;
  demand: string;
  growth: string;
  experience: string;
  salary_range: string;
}

const CareerBank = () => {
  const [careers, setCareers] = useState<Career[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedExperience, setSelectedExperience] = useState("all");
  const [selectedSalary, setSelectedSalary] = useState("all");

  // Fetch careers from the backend when the component mounts
  useEffect(() => {
    const fetchCareers = async () => {
      try {
        const response = await api.get<Career[]>("/careers/");
        setCareers(response.data);
      } catch (error) {
        console.error("Failed to fetch careers:", error);
        toast({
          title: "Error",
          description: "Could not load career data. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchCareers();
  }, []);

  const filteredCareers = useMemo(() => {
    return careers.filter(career => {
      const matchesSearch = searchTerm === "" || 
        career.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        career.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        career.required_skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = selectedCategory === "all" || career.domain === selectedCategory;
      const matchesExperience = selectedExperience === "all" || career.experience === selectedExperience;
      const matchesSalary = selectedSalary === "all" || career.salary_range === selectedSalary;
      
      return matchesSearch && matchesCategory && matchesExperience && matchesSalary;
    });
  }, [searchTerm, selectedCategory, selectedExperience, selectedSalary, careers]);

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Career Bank</h1>
          <p className="text-muted-foreground">Explore thousands of career opportunities tailored to your interests</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search careers, companies, or skills..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" className="flex items-center">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="technology">Technology</SelectItem>
                <SelectItem value="healthcare">Healthcare</SelectItem>
                <SelectItem value="finance">Finance</SelectItem>
                <SelectItem value="design">Design</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
                <SelectItem value="data-analytics">Data & Analytics</SelectItem>
                <SelectItem value="management">Management</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={selectedExperience} onValueChange={setSelectedExperience}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Experience" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="entry">Entry Level</SelectItem>
                <SelectItem value="mid">Mid Level</SelectItem>
                <SelectItem value="senior">Senior Level</SelectItem>
                <SelectItem value="executive">Executive</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={selectedSalary} onValueChange={setSelectedSalary}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Salary Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ranges</SelectItem>
                <SelectItem value="0-50k">$0 - $50k</SelectItem>
                <SelectItem value="50-80k">$50k - $80k</SelectItem>
                <SelectItem value="80-120k">$80k - $120k</SelectItem>
                <SelectItem value="120k+">$120k+</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            Showing {filteredCareers.length} of {careers.length} careers
          </p>
        </div>

        {/* Results */}
        <div className="grid gap-6">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="ml-4 text-lg">Loading Careers...</p>
            </div>
          ) : filteredCareers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground mb-2">No careers found</p>
              <p className="text-sm text-muted-foreground">Try adjusting your search or filters</p>
            </div>
          ) : (
            filteredCareers.map((career) => (
              <Card key={career.career_id} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl mb-2">{career.title}</CardTitle>
                      <p className="text-muted-foreground">{career.company}</p>
                    </div>
                    <Button variant="ghost" size="icon">
                      <Star className="w-5 h-5" />
                    </Button>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2">
                      <p className="text-muted-foreground mb-4">{career.description}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {career.required_skills.map((skill, skillIndex) => (
                          <Badge key={skillIndex} variant="secondary">{skill}</Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm">
                          <DollarSign className="w-4 h-4 mr-1 text-primary" />
                          <span className="font-medium">{career.expected_salary}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm">
                          <TrendingUp className="w-4 h-4 mr-1 text-green-500" />
                          <span>Growth: {career.growth}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm">
                          <Users className="w-4 h-4 mr-1 text-secondary" />
                          <span>Demand: {career.demand}</span>
                        </div>
                      </div>
                      
                      <Button className="w-full btn-hero">Learn More</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default CareerBank;