import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/Dashboard";
import CareerBank from "./pages/CareerBank";
import Quiz from "./pages/Quiz";
import Multimedia from "./pages/Multimedia";
import About from "./pages/About";
import Profile from "./pages/profile";

import Footer from "./components/footer";
import { Navigation } from "./components/Navigation";
import ThemeToggle from "./components/themetoggle";
import EditProfile from "./pages/profile";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      {/* Toast Notifications */}
      <Toaster />
      <Sonner />

      <BrowserRouter>
        <div className="flex flex-col min-h-screen relative transition-colors duration-500">
          {/* Navigation bar at the top */}
          <Navigation />

          {/* Theme Toggle fixed at top-right */}
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
            <ThemeToggle />
          </div>

          {/* Page Content */}
          <div className="flex-grow transition-colors duration-500">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/careers" element={<CareerBank />} />
              <Route path="/multimedia" element={<Multimedia />} />
              <Route path="/quiz" element={<Quiz />} />
              <Route path="/about" element={<About />} />
              <Route path="/profile" element={<EditProfile/>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>

          {/* Footer on all pages */}
          <Footer />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
