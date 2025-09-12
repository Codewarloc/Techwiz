// src/pages/auth/Register.tsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    userType: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // input change handler (for Input elements)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((s) => ({ ...s, [id]: value }));
  };

  // select value handler (your Select component uses onValueChange)
  const handleSelectChange = (value: string) => {
    setFormData((s) => ({ ...s, userType: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // client-side validation
    if (!formData.email || !formData.password || !formData.confirmPassword) {
      setErrorMsg("Please fill in email and password fields.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      // Build uname expected by the backend (backend expects 'uname' not 'username')
      const uname =
        (formData.username && formData.username.trim()) ||
        `${(formData.firstName || "").trim()} ${(formData.lastName || "").trim()}`.trim() ||
        (formData.email ? formData.email.split("@")[0] : "");

      const payload = {
        uname, // IMPORTANT: backend expects 'uname'
        email: formData.email,
        password: formData.password,
        first_name: formData.firstName,
        last_name: formData.lastName,
        role: formData.userType || "student",
      };

      // 'api' baseURL should include /api/ (e.g. http://127.0.0.1:8000/api/)
      const res = await api.post("users/", payload);

      if (res.status === 201 || res.status === 200) {
        alert("Account created successfully!");
        navigate("/login");
      } else {
        setErrorMsg("Unexpected response from server.");
      }
    } catch (err: any) {
      // show DRF validation errors or network problems clearly
      if (err.response) {
        console.error("Server responded with:", err.response.status, err.response.data);
        const data = err.response.data;
        if (typeof data === "object") {
          const fieldErrors = Object.entries(data)
            .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(", ") : v}`)
            .join(" | ");
          setErrorMsg(fieldErrors || "Registration failed (server validation).");
        } else {
          setErrorMsg(String(data));
        }
      } else {
        console.error("Network / Axios error:", err);
        setErrorMsg("Network error - please check server/CORS.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float" />
      <div
        className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-float"
        style={{ animationDelay: "2s" }}
      />

      <div className="w-full max-w-md relative z-10">
        <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        <Card className="backdrop-blur-sm bg-card/50 border-border/50 shadow-2xl">
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <CardTitle className="text-2xl font-bold">Join PathSeeker</CardTitle>
            <CardDescription>Create your account and start your career journey</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {errorMsg && <div className="text-sm text-red-600">{errorMsg}</div>}

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="username">User Name</Label>
                  <Input id="username" placeholder="john_doe" value={formData.username} onChange={handleChange} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" placeholder="John" value={formData.firstName} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" placeholder="Doe" value={formData.lastName} onChange={handleChange} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="john@example.com" value={formData.email} onChange={handleChange} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="userType">I am a</Label>
                <Select value={formData.userType} onValueChange={handleSelectChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your current status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="graduate">Recent Graduate</SelectItem>
                    <SelectItem value="professional">Working Professional</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="Create a strong password" value={formData.password} onChange={handleChange} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input id="confirmPassword" type="password" placeholder="Confirm your password" value={formData.confirmPassword} onChange={handleChange} />
              </div>

              <Button type="submit" className="w-full btn-hero" disabled={loading}>
                {loading ? "Creating account..." : "Create Account"}
              </Button>
            </form>

            <div className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="text-primary hover:underline font-medium">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Register;
