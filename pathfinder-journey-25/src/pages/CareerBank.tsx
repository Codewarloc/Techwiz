
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Star, TrendingUp, Users, DollarSign } from "lucide-react";
import { useState, useMemo } from "react";

const CareerBank = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedExperience, setSelectedExperience] = useState("all");
  const [selectedSalary, setSelectedSalary] = useState("all");

  const careers = [
    {
      title: "Software Engineer",
      company: "Tech Corp",
      salary: "$75,000 - $120,000",
      salaryRange: "80-120k",
      demand: "High",
      growth: "+22%",
      category: "technology",
      experience: "mid",
      skills: ["JavaScript", "React", "Node.js"],
      description: "Build and maintain software applications using modern technologies and frameworks."
    },
    {
      title: "Data Scientist", 
      company: "Analytics Inc",
      salary: "$80,000 - $130,000",
      salaryRange: "80-120k",
      demand: "Very High",
      growth: "+35%",
      category: "data-analytics",
      experience: "mid",
      skills: ["Python", "Machine Learning", "SQL"],
      description: "Analyze complex data to help organizations make informed decisions and predictions."
    },
    {
      title: "UX Designer",
      company: "Design Studio",
      salary: "$65,000 - $95,000",
      salaryRange: "50-80k",
      demand: "High",
      growth: "+18%",
      category: "design",
      experience: "mid",
      skills: ["Figma", "User Research", "Prototyping"],
      description: "Design user-centered digital experiences that delight and engage users."
    },
    {
      title: "Product Manager",
      company: "Startup Inc",
      salary: "$90,000 - $140,000",
      salaryRange: "120k+",
      demand: "High", 
      growth: "+25%",
      category: "management",
      experience: "senior",
      skills: ["Strategy", "Analytics", "Leadership"],
      description: "Drive product vision and strategy while coordinating cross-functional teams."
    },
    {
      title: "Frontend Developer",
      company: "Web Agency",
      salary: "$60,000 - $90,000",
      salaryRange: "50-80k",
      demand: "High",
      growth: "+20%",
      category: "technology",
      experience: "entry",
      skills: ["HTML", "CSS", "JavaScript", "React"],
      description: "Create engaging user interfaces and responsive web applications."
    },
    {
      title: "Digital Marketing Manager",
      company: "Marketing Pro",
      salary: "$55,000 - $85,000",
      salaryRange: "50-80k",
      demand: "Medium",
      growth: "+15%",
      category: "marketing",
      experience: "mid",
      skills: ["SEO", "Social Media", "Analytics", "Content Strategy"],
      description: "Develop and execute digital marketing campaigns across multiple channels."
    },
    {
      title: "Cybersecurity Analyst",
      company: "SecureTech",
      salary: "$70,000 - $110,000",
      salaryRange: "80-120k",
      demand: "Very High",
      growth: "+28%",
      category: "technology",
      experience: "mid",
      skills: ["Network Security", "Risk Assessment", "Incident Response"],
      description: "Protect organizations from cyber threats and security breaches."
    },
    {
      title: "Financial Analyst",
      company: "Finance Corp",
      salary: "$65,000 - $95,000",
      salaryRange: "50-80k",
      demand: "Medium",
      growth: "+12%",
      category: "finance",
      experience: "entry",
      skills: ["Excel", "Financial Modeling", "Data Analysis"],
      description: "Analyze financial data and trends to guide business decisions."
    },
    {
      title: "Nurse Practitioner",
      company: "City Hospital",
      salary: "$85,000 - $115,000",
      salaryRange: "80-120k",
      demand: "Very High",
      growth: "+45%",
      category: "healthcare",
      experience: "senior",
      skills: ["Patient Care", "Diagnosis", "Treatment Planning"],
      description: "Provide advanced nursing care and medical services to patients."
    },
    {
      title: "HR Manager",
      company: "People First",
      salary: "$70,000 - $100,000",
      salaryRange: "80-120k",
      demand: "Medium",
      growth: "+10%",
      category: "management",
      experience: "senior",
      skills: ["Recruitment", "Employee Relations", "Policy Development"],
      description: "Oversee human resources functions and employee development programs."
    },
    {
      title: "Cloud Architect",
      company: "CloudTech",
      salary: "$120,000 - $180,000",
      salaryRange: "120k+",
      demand: "Very High",
      growth: "+30%",
      category: "technology",
      experience: "senior",
      skills: ["AWS", "Azure", "Kubernetes", "DevOps"],
      description: "Design and implement cloud infrastructure and migration strategies."
    },
    {
      title: "Content Writer",
      company: "Content Co",
      salary: "$40,000 - $60,000",
      salaryRange: "0-50k",
      demand: "Medium",
      growth: "+8%",
      category: "marketing",
      experience: "entry",
      skills: ["Writing", "SEO", "Research", "Editing"],
      description: "Create engaging content for websites, blogs, and marketing materials."
    }
  ];

  const filteredCareers = useMemo(() => {
    return careers.filter(career => {
      const matchesSearch = searchTerm === "" || 
        career.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        career.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        career.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = selectedCategory === "all" || career.category === selectedCategory;
      const matchesExperience = selectedExperience === "all" || career.experience === selectedExperience;
      const matchesSalary = selectedSalary === "all" || career.salaryRange === selectedSalary;
      
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
          {filteredCareers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground mb-2">No careers found</p>
              <p className="text-sm text-muted-foreground">Try adjusting your search or filters</p>
            </div>
          ) : (
            filteredCareers.map((career, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
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
                        {career.skills.map((skill, skillIndex) => (
                          <Badge key={skillIndex} variant="secondary">{skill}</Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm">
                          <DollarSign className="w-4 h-4 mr-1 text-primary" />
                          <span className="font-medium">{career.salary}</span>
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