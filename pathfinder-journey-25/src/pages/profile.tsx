import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  PlusCircle,
  MinusCircle,
  Briefcase,
  GraduationCap,
  Code,
  Heart,
  Calendar as CalendarIcon,
} from "lucide-react";

// shadcn modal
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

// shadcn calendar & popover
import { format, parseISO } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

//
// DatePicker component (uses shadcn Calendar inside a Popover)
//
interface DatePickerProps {
  value: string;
  onChange: (dateIso: string) => void;
  placeholder?: string;
}

const DatePicker: React.FC<DatePickerProps> = ({ value, onChange, placeholder }) => {
  const date = value ? parseISO(value) : undefined;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={`w-full justify-start text-left font-normal ${!date ? "text-muted-foreground" : ""}`}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : placeholder || "Pick a date"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(d) => d && onChange(d.toISOString().split("T")[0])}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
};

//
// Types
//
interface Education {
  id: number;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string; // ISO yyyy-mm-dd or empty
  endDate: string; // ISO yyyy-mm-dd or empty / "Present"
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

const formatDate = (iso?: string) => {
  if (!iso) return "";
  try {
    return format(parseISO(iso), "MMM yyyy");
  } catch {
    return iso;
  }
};

//
// Main component
//
const EditProfile: React.FC = () => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

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

  // update top-level input fields (firstName, lastName, bio)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (!profile) return;
    setProfile((prev) => (prev ? { ...prev, [name]: value } : prev));
  };

  // helper to set a value for a dynamic item (education/workExperience)
  const setDynamicFieldValue = (
    index: number,
    field: "education" | "workExperience",
    name: string,
    value: string
  ) => {
    if (!profile) return;
    const arr = [...profile[field]];
    arr[index] = { ...arr[index], [name]: value } as any;
    setProfile({ ...profile, [field]: arr });
  };

  // add / remove dynamic blocks
  const addDynamicField = (field: "education" | "workExperience") => {
    if (!profile) return;
    const arr = [...profile[field]];
    const newId = arr.length > 0 ? arr[arr.length - 1].id + 1 : Date.now();
    if (field === "education") {
      arr.push({ id: newId, institution: "", degree: "", fieldOfStudy: "", startDate: "", endDate: "" });
    } else {
      arr.push({ id: newId, company: "", title: "", startDate: "", endDate: "", description: "" });
    }
    setProfile({ ...profile, [field]: arr });
  };

  const removeDynamicField = (index: number, field: "education" | "workExperience") => {
    if (!profile) return;
    const arr = [...profile[field]];
    arr.splice(index, 1);
    setProfile({ ...profile, [field]: arr });
  };

  // arrays for skills/interests
  const setArrayFieldValue = (index: number, field: "skills" | "interests", value: string) => {
    if (!profile) return;
    const arr = [...profile[field]];
    arr[index] = value;
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

  // submit (persist)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setSaving(true);
    setError(null);

    try {
      const res = await api.patch("profiles/me/", {
        bio: profile.bio,
        education: profile.education,
        work_experience: profile.workExperience,
        skills: profile.skills,
        interests: profile.interests,
      });

      // merge returned data but keep first/last name that are handled elsewhere
      setProfile((prev) =>
        prev ? { ...prev, ...res.data, firstName: prev.firstName, lastName: prev.lastName } : prev
      );

      setShowModal(true);
    } catch (err: any) {
      console.error("Save error:", err.response?.data || err.message);
      setError("Failed to save profile. " + (err.response?.data ? JSON.stringify(err.response.data) : ""));
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
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold">Name</h3>
              <p>
                {profile.firstName} {profile.lastName}
              </p>
            </div>

            <div>
              <h3 className="font-semibold">Bio</h3>
              <p>{profile.bio || "No bio added yet."}</p>
            </div>

            <div>
              <h3 className="font-semibold">Education</h3>
              {profile.education.length > 0 ? (
                <ul className="list-disc list-inside space-y-1">
                  {profile.education.map((edu) => (
                    <li key={edu.id}>
                      {edu.degree} in {edu.fieldOfStudy} at {edu.institution} (
                      {formatDate(edu.startDate) || "—"} – {edu.endDate ? formatDate(edu.endDate) : "Present"})
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No education details yet.</p>
              )}
            </div>

            <div>
              <h3 className="font-semibold">Work Experience</h3>
              {profile.workExperience.length > 0 ? (
                <ul className="list-disc list-inside space-y-1">
                  {profile.workExperience.map((w) => (
                    <li key={w.id}>
                      {w.title} at {w.company} ({formatDate(w.startDate) || "—"} – {w.endDate ? formatDate(w.endDate) : "Present"})
                      <br />
                      <span className="text-muted-foreground text-sm">{w.description}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No work experience yet.</p>
              )}
            </div>

            <div>
              <h3 className="font-semibold">Skills</h3>
              {profile.skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((s, i) => (
                    <span key={i} className="px-2 py-1 bg-primary/10 rounded-md text-sm">
                      {s}
                    </span>
                  ))}
                </div>
              ) : (
                <p>No skills listed yet.</p>
              )}
            </div>

            <div>
              <h3 className="font-semibold">Interests</h3>
              {profile.interests.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {profile.interests.map((i, idx) => (
                    <span key={idx} className="px-2 py-1 bg-secondary/10 rounded-md text-sm">
                      {i}
                    </span>
                  ))}
                </div>
              ) : (
                <p>No interests listed yet.</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Edit Form */}
        <Card>
          <CardHeader>
            <CardTitle>Edit Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Info */}
              <div className="space-y-4">
                <h3 className="flex items-center text-lg font-semibold">
                  <Briefcase className="mr-2" /> Personal Info
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>First Name</Label>
                    <Input name="firstName" value={profile.firstName} onChange={handleInputChange} />
                  </div>
                  <div>
                    <Label>Last Name</Label>
                    <Input name="lastName" value={profile.lastName} onChange={handleInputChange} />
                  </div>
                </div>
                <div>
                  <Label>Bio</Label>
                  <Textarea name="bio" value={profile.bio} onChange={handleInputChange} rows={3} />
                </div>
              </div>

              {/* Education */}
              <div className="space-y-4">
                <h3 className="flex items-center text-lg font-semibold">
                  <GraduationCap className="mr-2" /> Education
                </h3>
                {profile.education.map((edu, i) => (
                  <div key={edu.id} className="border p-4 rounded-md relative group">
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100"
                      onClick={() => removeDynamicField(i, "education")}
                    >
                      <MinusCircle className="w-4 h-4" />
                    </Button>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <Input
                        name="institution"
                        value={edu.institution}
                        onChange={(e) => setDynamicFieldValue(i, "education", "institution", e.target.value)}
                        placeholder="Institution"
                      />
                      <Input
                        name="degree"
                        value={edu.degree}
                        onChange={(e) => setDynamicFieldValue(i, "education", "degree", e.target.value)}
                        placeholder="Degree"
                      />
                    </div>

                    <Input
                      name="fieldOfStudy"
                      value={edu.fieldOfStudy}
                      onChange={(e) => setDynamicFieldValue(i, "education", "fieldOfStudy", e.target.value)}
                      placeholder="Field of Study"
                    />

                    <div className="grid grid-cols-2 gap-2">
                      <DatePicker
                        value={edu.startDate}
                        onChange={(val) => setDynamicFieldValue(i, "education", "startDate", val)}
                        placeholder="Start Date"
                      />
                      <DatePicker
                        value={edu.endDate}
                        onChange={(val) => setDynamicFieldValue(i, "education", "endDate", val)}
                        placeholder="End Date"
                      />
                    </div>
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={() => addDynamicField("education")} className="w-full">
                  <PlusCircle className="mr-2" /> Add Education
                </Button>
              </div>

              {/* Work Experience */}
              <div className="space-y-4">
                <h3 className="flex items-center text-lg font-semibold">
                  <Briefcase className="mr-2" /> Work Experience
                </h3>
                {profile.workExperience.map((w, i) => (
                  <div key={w.id} className="border p-4 rounded-md relative group">
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100"
                      onClick={() => removeDynamicField(i, "workExperience")}
                    >
                      <MinusCircle className="w-4 h-4" />
                    </Button>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <Input
                        name="company"
                        value={w.company}
                        onChange={(e) => setDynamicFieldValue(i, "workExperience", "company", e.target.value)}
                        placeholder="Company"
                      />
                      <Input
                        name="title"
                        value={w.title}
                        onChange={(e) => setDynamicFieldValue(i, "workExperience", "title", e.target.value)}
                        placeholder="Job Title"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <DatePicker
                        value={w.startDate}
                        onChange={(val) => setDynamicFieldValue(i, "workExperience", "startDate", val)}
                        placeholder="Start Date"
                      />
                      <DatePicker
                        value={w.endDate}
                        onChange={(val) => setDynamicFieldValue(i, "workExperience", "endDate", val)}
                        placeholder="End Date"
                      />
                    </div>

                    <Textarea
                      name="description"
                      value={w.description}
                      onChange={(e) => setDynamicFieldValue(i, "workExperience", "description", e.target.value)}
                      rows={3}
                      placeholder="Description"
                    />
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={() => addDynamicField("workExperience")} className="w-full">
                  <PlusCircle className="mr-2" /> Add Work Experience
                </Button>
              </div>

              {/* Skills */}
              <div className="space-y-4">
                <h3 className="flex items-center text-lg font-semibold">
                  <Code className="mr-2" /> Skills
                </h3>
                {profile.skills.map((s, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Input
                      value={s}
                      onChange={(e) => setArrayFieldValue(i, "skills", e.target.value)}
                    />
                    <Button type="button" size="icon" variant="outline" onClick={() => removeArrayField(i, "skills")}>
                      <MinusCircle className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={() => addArrayField("skills")} className="w-full">
                  <PlusCircle className="mr-2" /> Add Skill
                </Button>
              </div>

              {/* Interests */}
              <div className="space-y-4">
                <h3 className="flex items-center text-lg font-semibold">
                  <Heart className="mr-2" /> Interests
                </h3>
                {profile.interests.map((i, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <Input value={i} onChange={(e) => setArrayFieldValue(idx, "interests", e.target.value)} />
                    <Button type="button" size="icon" variant="outline" onClick={() => removeArrayField(idx, "interests")}>
                      <MinusCircle className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={() => addArrayField("interests")} className="w-full">
                  <PlusCircle className="mr-2" /> Add Interest
                </Button>
              </div>

              <Button type="submit" className="w-full btn-hero" disabled={saving}>
                {saving ? "Saving..." : "Save Profile"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Success Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Profile Updated</DialogTitle>
            <DialogDescription>Your profile has been successfully saved.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setShowModal(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EditProfile;
