import { Link } from "react-router-dom";
import { Download, ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const footerResources = [
  { id: 1, title: "Beginner’s Guide to Careers" },
  { id: 2, title: "Scholarship Checklist" },
  { id: 3, title: "Top 10 Skills Infographic" },
];

const Footer = () => {
  return (
    <footer className="relative bg-background/90 backdrop-blur-sm border-t border-border py-16 mt-16 overflow-hidden transition-colors duration-500">
      {/* Footer Floating Gradients */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-float z-0 transition-colors duration-500" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-float z-0 transition-colors duration-500" />

      <div className="relative z-10 container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 transition-colors duration-500">
        {/* About */}
        <div>
          <h3 className="text-xl font-bold mb-4">PathSeeker</h3>
          <p className="text-sm text-muted-foreground transition-colors duration-500">
            Helping students, graduates, and professionals explore career paths
            with AI-powered guidance, expert insights, and practical resources.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <Link to="/register" className="hover:text-primary transition-colors">
                Start Journey
              </Link>
            </li>
            <li>
              <Link to="/quiz" className="hover:text-primary transition-colors">
                Take Quiz
              </Link>
            </li>
            <li>
              <Link to="/resources" className="hover:text-primary transition-colors">
                Resources
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-primary transition-colors">
                About
              </Link>
            </li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h4 className="font-semibold mb-4">Resources</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {footerResources.map((res) => (
              <li
                key={res.id}
                className="flex items-center justify-between hover:text-primary transition-colors"
              >
                {res.title} <Download className="w-4 h-4 ml-2" />
              </li>
            ))}
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h4 className="font-semibold mb-4">Stay Updated</h4>
          <p className="text-sm text-muted-foreground mb-3 transition-colors duration-500">
            Subscribe to our newsletter to receive career tips and updates.
          </p>
          <div className="flex space-x-2">
            <Input
              type="email"
              placeholder="Enter your email"
              className="flex-1 transition-colors duration-500"
            />
            <Button>
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>

          <div className="flex space-x-3 mt-4 text-muted-foreground transition-colors duration-500">
            <Link to="#" className="hover:text-primary transition-colors">
              Twitter
            </Link>
            <Link to="#" className="hover:text-primary transition-colors">
              LinkedIn
            </Link>
            <Link to="#" className="hover:text-primary transition-colors">
              GitHub
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-12 border-t border-border pt-6 text-center text-sm text-muted-foreground relative z-10 transition-colors duration-500">
        &copy; {new Date().getFullYear()} PathSeeker. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
