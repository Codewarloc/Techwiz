// src/components/Navigation.tsx
import { Button } from "@/components/ui/button";
import { Menu, X, Grid, User, LogOut } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { useAuth } from "@/pages/auth/authcontext";

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth(); // ✅ using AuthContext

  return (
    <nav className="bg-background/80 backdrop-blur-sm border-b border-border/50 sticky top-0 z-50 transition-colors duration-500">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center transition-colors duration-500">
              <span className="text-white font-bold text-sm">P</span>
            </div>
            <span className="text-2xl font-bold text-gradient">PathSeeker</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6 transition-colors duration-500">
            <Link to="/" className="text-muted-foreground hover:text-foreground">Home</Link>
            <Link to="/careers" className="text-muted-foreground hover:text-foreground">Careers</Link>
            <Link to="/quiz" className="text-muted-foreground hover:text-foreground">Take Quiz</Link>
            <Link to="/multimedia" className="text-muted-foreground hover:text-foreground">Multimedia</Link>
            <Link to="/about" className="text-muted-foreground hover:text-foreground">About</Link>
          </div>

          {/* Auth + Icons */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {/* Dashboard Icon (desktop) */}
                <div className="hidden md:block">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link to="/dashboard" className="text-muted-foreground hover:text-foreground">
                        <Grid className="w-6 h-6" />
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>Dashboard</TooltipContent>
                  </Tooltip>
                </div>

                {/* Profile Icon */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link to="/profile" className="text-muted-foreground hover:text-foreground">
                      <User className="w-6 h-6" />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>My Profile</TooltipContent>
                </Tooltip>

                {/* Logout */}
                <Button variant="ghost" onClick={logout} title="Logout">
                  <LogOut className="w-6 h-6" />
                </Button>
              </>
            ) : (
              <div className="hidden md:flex items-center space-x-4">
                <Link to="/login">
                  <Button variant="ghost">Sign In</Button>
                </Link>
                <Link to="/register">
                  <Button className="btn-hero">Get Started</Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border/50">
            <div className="flex flex-col space-y-4">
              <Link to="/" className="hover:text-foreground">Home</Link>
              <Link to="/careers" className="hover:text-foreground">Careers</Link>
              <Link to="/quiz" className="hover:text-foreground">Take Quiz</Link>
              <Link to="/multimedia" className="hover:text-foreground">Multimedia</Link>
              <Link to="/about" className="hover:text-foreground">About</Link>

              {isAuthenticated ? (
                <>
                  <Link to="/dashboard" className="flex items-center space-x-2">
                    <Grid className="w-6 h-6" />
                    <span>Dashboard</span>
                  </Link>
                  <Link to="/profile" className="flex items-center space-x-2">
                    <User className="w-6 h-6" />
                    <span>My Profile</span>
                  </Link>
                  <Button variant="ghost" className="w-full" onClick={logout}>
                    <LogOut className="w-6 h-6 mr-2" />
                    Logout
                  </Button>
                </>
              ) : (
                <div className="flex flex-col space-y-2 pt-4">
                  <Link to="/login">
                    <Button variant="ghost" className="w-full">Sign In</Button>
                  </Link>
                  <Link to="/register">
                    <Button className="btn-hero w-full">Get Started</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
