import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Brain, ArrowRight, ArrowLeft, Award, Briefcase } from "lucide-react";
import { useState } from "react";
import axios from "axios";

const Quiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);

  // Questions with categories
  const questions = [
    {
      question: "What type of work environment do you prefer?",
      options: [
        { text: "Collaborative team environment", category: "Leadership" },
        { text: "Independent work with minimal supervision", category: "Analytical" },
        { text: "Dynamic, fast-paced environment", category: "Creative" },
        { text: "Structured, organized workplace", category: "Tech" },
      ],
    },
    {
      question: "Which activity sounds most appealing to you?",
      options: [
        { text: "Solving complex technical problems", category: "Tech" },
        { text: "Creating visual designs and experiences", category: "Creative" },
        { text: "Analyzing data to find insights", category: "Analytical" },
        { text: "Leading and managing teams", category: "Leadership" },
      ],
    },
    {
      question: "What motivates you most in your career?",
      options: [
        { text: "Making a positive impact on society", category: "Leadership" },
        { text: "Financial success and stability", category: "Analytical" },
        { text: "Creative expression and innovation", category: "Creative" },
        { text: "Recognition and professional growth", category: "Tech" },
      ],
    },
    {
      question: "How do you prefer to learn new skills?",
      options: [
        { text: "Hands-on experience and practice", category: "Tech" },
        { text: "Reading and theoretical study", category: "Analytical" },
        { text: "Mentorship and guidance from experts", category: "Leadership" },
        { text: "Trial and error experimentation", category: "Creative" },
      ],
    },
  ];

  // Career suggestions
  const careerSuggestions: Record<string, string[]> = {
    Tech: ["Software Engineer", "Data Scientist", "Cloud Engineer", "Cybersecurity Analyst"],
    Creative: ["UX/UI Designer", "Graphic Designer", "Content Creator", "Animator"],
    Analytical: ["Business Analyst", "Financial Analyst", "Research Scientist", "Statistician"],
    Leadership: ["Project Manager", "Team Lead", "Entrepreneur", "HR Manager"],
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleAnswerChange = (value: string) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = value;
    setAnswers(newAnswers);
  };

  const calculateResults = () => {
    const scores: Record<string, number> = {
      Tech: 0,
      Creative: 0,
      Analytical: 0,
      Leadership: 0,
    };

    answers.forEach((answer, idx) => {
      const option = questions[idx].options.find((opt) => opt.text === answer);
      if (option) scores[option.category] += 1;
    });

    let bestCategory = "Tech";
    let maxScore = 0;
    for (const category in scores) {
      if (scores[category] > maxScore) {
        maxScore = scores[category];
        bestCategory = category;
      }
    }

    return { scores, bestCategory };
  };

  // ✅ Updated handleSubmit to POST results
  const handleSubmit = async () => {
    const { scores, bestCategory } = calculateResults();

    try {
      await axios.post("http://127.0.0.1:8000/api/quizresults/", {
        scores: scores,
        best_category: bestCategory,
      });

      console.log("Quiz result submitted successfully");
    } catch (err) {
      console.error("Error submitting quiz result:", err);
    }

    setShowResults(true);
  };

  if (showResults) {
    const { scores, bestCategory } = calculateResults();

    return (
      <>
       
        <div className="min-h-screen bg-background">
          <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="max-w-3xl mx-auto text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold mb-4">Your Results</h1>
              <p className="text-muted-foreground mb-6">
                Based on your answers, your strongest career path is:
              </p>
              <h2 className="text-2xl font-bold text-gradient mb-6">{bestCategory}</h2>

              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4 flex items-center justify-center">
                  <Briefcase className="w-5 h-5 mr-2 text-primary" /> Suggested Careers
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {careerSuggestions[bestCategory].map((career, idx) => (
                    <div
                      key={idx}
                      className="p-4 border border-border rounded-lg bg-card hover:bg-muted/50 transition-colors"
                    >
                      {career}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4 text-left">
                {Object.entries(scores).map(([category, score]) => (
                  <div key={category}>
                    <div className="flex justify-between mb-1">
                      <span className="font-medium">{category}</span>
                      <span>{score}</span>
                    </div>
                    <Progress value={(score / questions.length) * 100} className="h-2" />
                  </div>
                ))}
              </div>

              <Button className="mt-8" onClick={() => window.location.reload()}>
                Retake Quiz
              </Button>
            </div>
          </main>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-background">
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold mb-2">Career Assessment Quiz</h1>
              <p className="text-muted-foreground">
                Discover careers that match your interests and personality
              </p>
            </div>

            {/* Progress */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Progress</span>
                <span className="text-sm text-muted-foreground">
                  {currentQuestion + 1} of {questions.length}
                </span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            {/* Question Card */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-xl">
                  Question {currentQuestion + 1}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <h3 className="text-lg font-semibold mb-6">
                  {questions[currentQuestion].question}
                </h3>

                <RadioGroup
                  value={answers[currentQuestion] || ""}
                  onValueChange={handleAnswerChange}
                  className="space-y-4"
                >
                  {questions[currentQuestion].options.map((option, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-2 p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <RadioGroupItem value={option.text} id={`option-${index}`} />
                      <Label
                        htmlFor={`option-${index}`}
                        className="flex-1 cursor-pointer font-medium"
                      >
                        {option.text}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
                className="flex items-center"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>

              {currentQuestion === questions.length - 1 ? (
                <Button
                  className="btn-hero flex items-center"
                  disabled={!answers[currentQuestion]}
                  onClick={handleSubmit}
                >
                  Get Results
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  disabled={!answers[currentQuestion]}
                  className="flex items-center"
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Quiz;
