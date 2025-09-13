import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, PlusCircle, MinusCircle, Briefcase, GraduationCap, Code, Heart } from "lucide-react";

// Types
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
  id?: number;
}

const EditProfile: React.FC = () => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
   const fetchProfile = async () => {
  try {
  
    const userRes = await api.get("auth/me/");

    
    const profileRes = await api.get("profiles/me/");

    setProfile({
      firstName: userRes.data.first_name || "",
      lastName: userRes.data.last_name || "",
      bio: profileRes.data.bio || "",
      education: profileRes.data.education || [],
      workExperience: profileRes.data.work_experience || [],
      skills: profileRes.data.skills || [],
      interests: profileRes.data.interests || [],
      id: profileRes.data.id,
    });
  } catch (err) {
    console.error(err);
    setError("Failed to load profile.");
  } finally {
    setLoading(false);
  }
};


  fetchProfile();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (!profile) return;
    setProfile(prev => prev ? { ...prev, [name]: value } : prev);
  };

  const handleDynamicChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number,
    field: "education" | "workExperience"
  ) => {
    if (!profile) return;
    const { name, value } = e.target;
    const arr = [...profile[field]];
    arr[index] = { ...arr[index], [name]: value };
    setProfile({ ...profile, [field]: arr });
  };

  const addDynamicField = (field: "education" | "workExperience") => {
    if (!profile) return;
    const arr = [...profile[field]];
    const newId = arr.length > 0 ? arr[arr.length - 1].id + 1 : 1;
    if (field === "education") arr.push({ id: newId, institution: "", degree: "", fieldOfStudy: "", startDate: "", endDate: "" });
    else arr.push({ id: newId, company: "", title: "", startDate: "", endDate: "", description: "" });
    setProfile({ ...profile, [field]: arr });
  };

  const removeDynamicField = (index: number, field: "education" | "workExperience") => {
    if (!profile) return;
    const arr = [...profile[field]];
    arr.splice(index, 1);
    setProfile({ ...profile, [field]: arr });
  };

  const handleArrayChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
    field: "skills" | "interests"
  ) => {
    if (!profile) return;
    const arr = [...profile[field]];
    arr[index] = e.target.value;
    setProfile({ ...profile, [field]: arr });
  };

  const addArrayField = (field: "skills" | "interests") => {
    if (!profile) return;
    setProfile({ ...profile, [field]: [...profile[field], ""] });
  };

  const removeArrayField = (index: number, field: "skills" | "interests") => {
    if (!profile) return;
    const arr = [...profile[field]];
    arr.splice(index, 1);
    setProfile({ ...profile, [field]: arr });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setSaving(true);
    setError(null);

    try {
      await api.patch("auth/me/", { first_name: profile.firstName, last_name: profile.lastName });
      await api.patch(`profiles/${profile.id}/`, {
        bio: profile.bio,
        education: profile.education,
        work_experience: profile.workExperience,
        skills: profile.skills,
        interests: profile.interests,
      });
      alert("Profile saved successfully!");
    } catch (err) {
      console.error(err);
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
      <div className="w-full max-w-3xl">
        <Link to="/dashboard" className="flex items-center text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="mr-2 w-4 h-4" /> Back to Dashboard
        </Link>

        {/* Profile Overview */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Profile Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div><strong>Name:</strong> {profile.firstName} {profile.lastName}</div>
              <div><strong>Bio:</strong> {profile.bio || <span className="text-muted-foreground">No bio yet.</span>}</div>
              <div>
                <strong>Education:</strong>
                {profile.education.length ? (
                  <ul className="ml-4 list-disc">
                    {profile.education.map(e => (
                      <li key={e.id}>{e.degree} in {e.fieldOfStudy} at {e.institution} ({e.startDate} - {e.endDate})</li>
                    ))}
                  </ul>
                ) : <span className="text-muted-foreground ml-2">No education added.</span>}
              </div>
              <div>
                <strong>Work Experience:</strong>
                {profile.workExperience.length ? (
                  <ul className="ml-4 list-disc">
                    {profile.workExperience.map(w => (
                      <li key={w.id}>
                        {w.title} at {w.company} ({w.startDate} - {w.endDate})<br />
                        <span className="text-muted-foreground">{w.description}</span>
                      </li>
                    ))}
                  </ul>
                ) : <span className="text-muted-foreground ml-2">No work experience added.</span>}
              </div>
              <div><strong>Skills:</strong> {profile.skills.length ? profile.skills.join(", ") : <span className="text-muted-foreground">No skills added.</span>}</div>
              <div><strong>Interests:</strong> {profile.interests.length ? profile.interests.join(", ") : <span className="text-muted-foreground">No interests added.</span>}</div>
            </div>
          </CardContent>
        </Card>

        {/* Edit Form */}
        <Card>
          <CardHeader><CardTitle>Edit Profile</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Personal Info */}
              <div className="space-y-4">
                <h3 className="flex items-center text-lg font-semibold"><Briefcase className="mr-2"/> Personal Info</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><Label>First Name</Label><Input name="firstName" value={profile.firstName} onChange={handleInputChange} /></div>
                  <div><Label>Last Name</Label><Input name="lastName" value={profile.lastName} onChange={handleInputChange} /></div>
                </div>
                <div><Label>Bio</Label><Textarea name="bio" value={profile.bio} onChange={handleInputChange} rows={3} /></div>
              </div>

              {/* Education */}
              <div className="space-y-4">
                <h3 className="flex items-center text-lg font-semibold"><GraduationCap className="mr-2"/> Education</h3>
                {profile.education.map((edu, i) => (
                  <div key={edu.id} className="border p-4 rounded-md relative group">
                    <Button type="button" variant="destructive" size="sm"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100"
                      onClick={() => removeDynamicField(i, "education")}>
                      <MinusCircle className="w-4 h-4"/>
                    </Button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <Input name="institution" value={edu.institution} onChange={e => handleDynamicChange(e, i, "education")} placeholder="Institution"/>
                      <Input name="degree" value={edu.degree} onChange={e => handleDynamicChange(e, i, "education")} placeholder="Degree"/>
                    </div>
                    <Input name="fieldOfStudy" value={edu.fieldOfStudy} onChange={e => handleDynamicChange(e, i, "education")} placeholder="Field of Study"/>
                    <div className="grid grid-cols-2 gap-2">
                      <Input type="month" name="startDate" value={edu.startDate} onChange={e => handleDynamicChange(e, i, "education")}/>
                      <Input type="month" name="endDate" value={edu.endDate} onChange={e => handleDynamicChange(e, i, "education")}/>
                    </div>
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={() => addDynamicField("education")} className="w-full"><PlusCircle className="mr-2"/> Add Education</Button>
              </div>

              {/* Work Experience */}
              <div className="space-y-4">
                <h3 className="flex items-center text-lg font-semibold"><Briefcase className="mr-2"/> Work Experience</h3>
                {profile.workExperience.map((w, i) => (
                  <div key={w.id} className="border p-4 rounded-md relative group">
                    <Button type="button" variant="destructive" size="sm"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100"
                      onClick={() => removeDynamicField(i, "workExperience")}>
                      <MinusCircle className="w-4 h-4"/>
                    </Button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <Input name="company" value={w.company} onChange={e => handleDynamicChange(e, i, "workExperience")} placeholder="Company"/>
                      <Input name="title" value={w.title} onChange={e => handleDynamicChange(e, i, "workExperience")} placeholder="Job Title"/>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Input type="month" name="startDate" value={w.startDate} onChange={e => handleDynamicChange(e, i, "workExperience")}/>
                      <Input type="month" name="endDate" value={w.endDate} onChange={e => handleDynamicChange(e, i, "workExperience")}/>
                    </div>
                    <Textarea name="description" value={w.description} onChange={e => handleDynamicChange(e, i, "workExperience")} rows={3} placeholder="Description"/>
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={() => addDynamicField("workExperience")} className="w-full"><PlusCircle className="mr-2"/> Add Work Experience</Button>
              </div>

              {/* Skills */}
              <div className="space-y-4">
                <h3 className="flex items-center text-lg font-semibold"><Code className="mr-2"/> Skills</h3>
                {profile.skills.map((s, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Input value={s} onChange={e => handleArrayChange(e, i, "skills")}/>
                    <Button type="button" size="icon" variant="outline" onClick={() => removeArrayField(i, "skills")}><MinusCircle className="w-4 h-4"/></Button>
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={() => addArrayField("skills")} className="w-full"><PlusCircle className="mr-2"/> Add Skill</Button>
              </div>

              {/* Interests */}
              <div className="space-y-4">
                <h3 className="flex items-center text-lg font-semibold"><Heart className="mr-2"/> Interests</h3>
                {profile.interests.map((i, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <Input value={i} onChange={e => handleArrayChange(e, idx, "interests")}/>
                    <Button type="button" size="icon" variant="outline" onClick={() => removeArrayField(idx, "interests")}><MinusCircle className="w-4 h-4"/></Button>
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={() => addArrayField("interests")} className="w-full"><PlusCircle className="mr-2"/> Add Interest</Button>
              </div>

              <Button type="submit" className="w-full btn-hero" disabled={saving}>{saving ? "Saving..." : "Save Profile"}</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditProfile;
