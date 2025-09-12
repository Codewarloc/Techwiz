// src/pages/EditProfile.tsx
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, PlusCircle, MinusCircle, Briefcase, GraduationCap, Code, Heart } from "lucide-react";

// Types for profile data
interface Education {
  id: number;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
}

interface WorkExperience {
  id: number;
  company: string;
  title: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface ProfileData {
  firstName: string;
  lastName: string;
  bio: string;
  education: Education[];
  workExperience: WorkExperience[];
  skills: string[];
  interests: string[];
  profile_id?: number;
}

const EditProfile: React.FC = () => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Fetch profile data from backend
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Get user info
        const userRes = await api.get("auth/me/");
        let profileRes;
        try {
          // Try to get profile info
          profileRes = await api.get(`profiles/${userRes.data.user_id}/`);
        } catch (err: any) {
          // If profile does not exist, create it
          profileRes = await api.post("profiles/", { user: userRes.data.user_id });
        }
        setProfile({
          firstName: userRes.data.first_name || "",
          lastName: userRes.data.last_name || "",
          bio: profileRes.data.bio || "",
          education: profileRes.data.education || [],
          workExperience: profileRes.data.work_experience || [],
          skills: profileRes.data.skills || [],
          interests: profileRes.data.interests || [],
          profile_id: profileRes.data.profile_id,
        });
      } catch (err: any) {
        setError("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // Input handlers (same as your current code, but check for null profile)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (!profile) return;
    setProfile((prev) => prev ? { ...prev, [name]: value } : prev);
  };

  // Handlers for dynamic fields (Education, Work Experience)
  const handleDynamicChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number,
    field: "education" | "workExperience"
  ) => {
    const { name, value } = e.target;
    setProfile((prev) => {
      const newArray = [...prev[field]];
      newArray[index] = { ...newArray[index], [name]: value };
      return { ...prev, [field]: newArray };
    });
  };

  const addDynamicField = (field: "education" | "workExperience") => {
    setProfile((prev) => {
      const newArray = [...prev[field]];
      const newId = newArray.length > 0 ? newArray[newArray.length - 1].id + 1 : 1;
      if (field === "education") {
        newArray.push({ id: newId, institution: "", degree: "", fieldOfStudy: "", startDate: "", endDate: "" });
      } else {
        newArray.push({ id: newId, company: "", title: "", startDate: "", endDate: "", description: "" });
      }
      return { ...prev, [field]: newArray };
    });
  };

  const removeDynamicField = (index: number, field: "education" | "workExperience") => {
    setProfile((prev) => {
      const newArray = [...prev[field]];
      newArray.splice(index, 1);
      return { ...prev, [field]: newArray };
    });
  };

  // Handlers for skills and interests
  const handleArrayChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
    field: "skills" | "interests"
  ) => {
    const { value } = e.target;
    setProfile((prev) => {
      const newArray = [...prev[field]];
      newArray[index] = value;
      return { ...prev, [field]: newArray };
    });
  };

  const addArrayField = (field: "skills" | "interests") => {
    setProfile((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }));
  };

  const removeArrayField = (index: number, field: "skills" | "interests") => {
    setProfile((prev) => {
      const newArray = [...prev[field]];
      newArray.splice(index, 1);
      return { ...prev, [field]: newArray };
    });
  };

  // Save profile to backend
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setSaving(true);
    setError(null);
    try {
      // Update user info
      await api.patch("auth/me/", {
        first_name: profile.firstName,
        last_name: profile.lastName,
      });
      // Update profile info
      await api.patch(`profiles/${profile.profile_id}/`, {
        bio: profile.bio,
        education: profile.education,
        work_experience: profile.workExperience,
        skills: profile.skills,
        interests: profile.interests,
      });
      alert("Profile saved successfully!");
    } catch (err: any) {
      setError("Failed to save profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!profile) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float dark:bg-primary/20" />
      <div
        className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-float dark:bg-secondary/20"
        style={{ animationDelay: '2s' }}
      />
      
      <div className="w-full max-w-2xl relative z-10">
        <div className="flex items-center mb-8">
          <Link to="/profile" className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Profile
          </Link>
        </div>

        {/* Profile Overview Section */}
        <Card className="mb-8 backdrop-blur-sm bg-card/50 border-border/50 shadow-2xl dark:bg-gray-800/50 dark:border-gray-700/50">
          <CardHeader>
            <CardTitle className="text-xl font-bold dark:text-white">Profile Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <span className="font-semibold">Name:</span> {profile.firstName} {profile.lastName}
              </div>
              <div>
                <span className="font-semibold">Bio:</span> {profile.bio || <span className="text-muted-foreground">No bio yet.</span>}
              </div>
              <div>
                <span className="font-semibold">Education:</span>
                {profile.education.length > 0 ? (
                  <ul className="list-disc ml-6">
                    {profile.education.map((edu) => (
                      <li key={edu.id}>
                        {edu.degree} in {edu.fieldOfStudy} at {edu.institution} ({edu.startDate} - {edu.endDate})
                      </li>
                    ))}
                  </ul>
                ) : (
                  <span className="text-muted-foreground ml-2">No education added.</span>
                )}
              </div>
              <div>
                <span className="font-semibold">Work Experience:</span>
                {profile.workExperience.length > 0 ? (
                  <ul className="list-disc ml-6">
                    {profile.workExperience.map((exp) => (
                      <li key={exp.id}>
                        {exp.title} at {exp.company} ({exp.startDate} - {exp.endDate})<br />
                        <span className="text-muted-foreground">{exp.description}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <span className="text-muted-foreground ml-2">No work experience added.</span>
                )}
              </div>
              <div>
                <span className="font-semibold">Skills:</span> {profile.skills.length > 0 ? profile.skills.join(", ") : <span className="text-muted-foreground">No skills added.</span>}
              </div>
              <div>
                <span className="font-semibold">Interests:</span> {profile.interests.length > 0 ? profile.interests.join(", ") : <span className="text-muted-foreground">No interests added.</span>}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Edit Form Section */}
        <Card className="backdrop-blur-sm bg-card/50 border-border/50 shadow-2xl dark:bg-gray-800/50 dark:border-gray-700/50">
          <CardHeader>
            <CardTitle className="text-2xl font-bold dark:text-white">Edit Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Personal Information Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center"><Briefcase className="mr-2 h-5 w-5 text-primary" /> Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" name="firstName" value={profile.firstName} onChange={handleInputChange} />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" name="lastName" value={profile.lastName} onChange={handleInputChange} />
                  </div>
                </div>
                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea id="bio" name="bio" value={profile.bio} onChange={handleInputChange} rows={4} />
                </div>
              </div>
              
              {/* Education Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center"><GraduationCap className="mr-2 h-5 w-5 text-primary" /> Education</h3>
                {profile.education.map((edu, index) => (
                  <div key={edu.id} className="space-y-2 border p-4 rounded-md relative group">
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removeDynamicField(index, "education")}
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MinusCircle className="h-4 w-4" />
                    </Button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Institution</Label>
                        <Input name="institution" value={edu.institution} onChange={(e) => handleDynamicChange(e, index, "education")} />
                      </div>
                      <div>
                        <Label>Degree</Label>
                        <Input name="degree" value={edu.degree} onChange={(e) => handleDynamicChange(e, index, "education")} />
                      </div>
                    </div>
                    <div>
                      <Label>Field of Study</Label>
                      <Input name="fieldOfStudy" value={edu.fieldOfStudy} onChange={(e) => handleDynamicChange(e, index, "education")} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Start Date</Label>
                        <Input type="month" name="startDate" value={edu.startDate} onChange={(e) => handleDynamicChange(e, index, "education")} />
                      </div>
                      <div>
                        <Label>End Date</Label>
                        <Input type="month" name="endDate" value={edu.endDate} onChange={(e) => handleDynamicChange(e, index, "education")} />
                      </div>
                    </div>
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={() => addDynamicField("education")} className="w-full">
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Education
                </Button>
              </div>

              {/* Work Experience Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center"><Briefcase className="mr-2 h-5 w-5 text-primary" /> Work Experience</h3>
                {profile.workExperience.map((exp, index) => (
                  <div key={exp.id} className="space-y-2 border p-4 rounded-md relative group">
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removeDynamicField(index, "workExperience")}
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MinusCircle className="h-4 w-4" />
                    </Button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Company</Label>
                        <Input name="company" value={exp.company} onChange={(e) => handleDynamicChange(e, index, "workExperience")} />
                      </div>
                      <div>
                        <Label>Job Title</Label>
                        <Input name="title" value={exp.title} onChange={(e) => handleDynamicChange(e, index, "workExperience")} />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Start Date</Label>
                        <Input type="month" name="startDate" value={exp.startDate} onChange={(e) => handleDynamicChange(e, index, "workExperience")} />
                      </div>
                      <div>
                        <Label>End Date</Label>
                        <Input type="month" name="endDate" value={exp.endDate} onChange={(e) => handleDynamicChange(e, index, "workExperience")} />
                      </div>
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Textarea name="description" value={exp.description} onChange={(e) => handleDynamicChange(e, index, "workExperience")} rows={3} />
                    </div>
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={() => addDynamicField("workExperience")} className="w-full">
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Work Experience
                </Button>
              </div>

              {/* Skills Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center"><Code className="mr-2 h-5 w-5 text-primary" /> Skills</h3>
                {profile.skills.map((skill, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input value={skill} onChange={(e) => handleArrayChange(e, index, "skills")} />
                    <Button type="button" variant="outline" size="icon" onClick={() => removeArrayField(index, "skills")}>
                      <MinusCircle className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={() => addArrayField("skills")} className="w-full">
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Skill
                </Button>
              </div>

              {/* Interests Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center"><Heart className="mr-2 h-5 w-5 text-primary" /> Interests</h3>
                {profile.interests.map((interest, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input value={interest} onChange={(e) => handleArrayChange(e, index, "interests")} />
                    <Button type="button" variant="outline" size="icon" onClick={() => removeArrayField(index, "interests")}>
                      <MinusCircle className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={() => addArrayField("interests")} className="w-full">
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Interest
                </Button>
              </div>
              
              <Button type="submit" className="w-full btn-hero" disabled={saving}>
                {saving ? "Saving..." : "Save Profile"}
              </Button>
              
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditProfile;