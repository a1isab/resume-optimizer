"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileUpload } from "@/components/FileUpload";
import { UsageCounter } from "@/components/UsageCounter";
import { Upload, FileText, Search, X, Check } from "lucide-react";

const JOB_TITLES = [
  // ── Tech / Engineering ──
  "Software Engineer",
  "Junior Software Engineer",
  "Software Developer",
  "Senior Software Engineer",
  "Staff Software Engineer",
  "Principal Software Engineer",
  "Distinguished Engineer",
  "Frontend Developer",
  "Senior Frontend Developer",
  "Backend Developer",
  "Senior Backend Developer",
  "Full Stack Developer",
  "Senior Full Stack Developer",
  "DevOps Engineer",
  "Senior DevOps Engineer",
  "Site Reliability Engineer",
  "Cloud Engineer",
  "Cloud Architect",
  "Platform Engineer",
  "Infrastructure Engineer",
  "Data Engineer",
  "Senior Data Engineer",
  "Data Scientist",
  "Senior Data Scientist",
  "Machine Learning Engineer",
  "AI Engineer",
  "AI Research Scientist",
  "NLP Engineer",
  "Computer Vision Engineer",
  "Mobile Developer",
  "iOS Developer",
  "Android Developer",
  "React Native Developer",
  "Flutter Developer",
  "Security Engineer",
  "Cybersecurity Analyst",
  "Penetration Tester",
  "Security Architect",
  "Network Engineer",
  "Systems Administrator",
  "Systems Engineer",
  "QA Engineer",
  "SDET",
  "Test Automation Engineer",
  "Manual Tester",
  "Embedded Software Engineer",
  "Firmware Engineer",
  "Game Developer",
  "Game Designer",
  "AR/VR Engineer",
  "Blockchain Developer",
  "Smart Contract Developer",
  "Database Administrator",
  "Data Architect",
  "Big Data Engineer",
  "ETL Developer",
  "BI Developer",
  "Solutions Architect",
  "Enterprise Architect",
  "Technical Architect",
  "Tech Lead",
  "Engineering Manager",
  "Director of Engineering",
  "VP of Engineering",
  "CTO",
  "Scrum Master",
  "Agile Coach",
  "Release Manager",
  "Build Engineer",

  // ── Product / Management ──
  "Product Manager",
  "Senior Product Manager",
  "Director of Product",
  "VP of Product",
  "Technical Product Manager",
  "Associate Product Manager",
  "Product Owner",
  "Program Manager",
  "Technical Program Manager",
  "Project Manager",
  "Senior Project Manager",
  "Project Coordinator",
  "Delivery Manager",
  "Portfolio Manager",

  // ── Design / Creative ──
  "Product Designer",
  "Senior Product Designer",
  "UX Designer",
  "Senior UX Designer",
  "UI Designer",
  "UI/UX Designer",
  "UX Researcher",
  "UX Writer",
  "Interaction Designer",
  "Visual Designer",
  "Graphic Designer",
  "Senior Graphic Designer",
  "Art Director",
  "Creative Director",
  "Brand Designer",
  "Brand Manager",
  "Motion Designer",
  "Animator",
  "3D Artist",
  "VFX Artist",
  "Illustrator",
  "Photographer",
  "Video Editor",
  "Content Creator",
  "Social Media Manager",
  "Copywriter",
  "Senior Copywriter",

  // ── Marketing / Sales ──
  "Marketing Manager",
  "Marketing Director",
  "VP of Marketing",
  "CMO",
  "Digital Marketing Manager",
  "SEO Specialist",
  "SEM Specialist",
  "Growth Marketing Manager",
  "Content Marketing Manager",
  "Content Strategist",
  "Marketing Analyst",
  "Marketing Coordinator",
  "Brand Strategist",
  "PR Manager",
  "Communications Manager",
  "Sales Representative",
  "Account Executive",
  "Senior Account Executive",
  "Sales Manager",
  "Sales Director",
  "VP of Sales",
  "BDR",
  "SDR",
  "Account Manager",
  "Customer Success Manager",
  "Sales Operations Analyst",
  "Revenue Operations Manager",
  "Business Development Manager",
  "Business Development Representative",

  // ── Finance / Accounting ──
  "Financial Analyst",
  "Senior Financial Analyst",
  "Finance Manager",
  "Finance Director",
  "CFO",
  "Accountant",
  "Senior Accountant",
  "Staff Accountant",
  "CPA",
  "Controller",
  "Auditor",
  "Internal Auditor",
  "Tax Manager",
  "Tax Analyst",
  "Investment Analyst",
  "Portfolio Manager",
  "Quantitative Analyst",
  "Risk Analyst",
  "Risk Manager",
  "Compliance Analyst",
  "Compliance Officer",
  "Underwriter",
  "Actuary",
  "Payroll Specialist",
  "Bookkeeper",
  "Budget Analyst",

  // ── Healthcare / Medical ──
  "Physician",
  "Doctor",
  "Surgeon",
  "Registered Nurse",
  "RN",
  "Nurse Practitioner",
  "Physician Assistant",
  "Medical Assistant",
  "Pharmacist",
  "Pharmacy Technician",
  "Dentist",
  "Dental Hygienist",
  "Physical Therapist",
  "Occupational Therapist",
  "Speech Therapist",
  "Veterinarian",
  "Veterinary Technician",
  "Medical Coder",
  "Medical Biller",
  "Healthcare Administrator",
  "Hospital Administrator",
  "Clinical Research Coordinator",
  "Lab Technician",
  "Medical Lab Scientist",
  "Radiologic Technologist",
  "Sonographer",
  "Paramedic",
  "EMT",
  "Home Health Aide",
  "CNA",

  // ── Legal ──
  "Lawyer",
  "Attorney",
  "Associate Attorney",
  "Partner",
  "Legal Counsel",
  "In-House Counsel",
  "Paralegal",
  "Legal Assistant",
  "Legal Secretary",
  "Compliance Specialist",
  "Contract Manager",
  "Patent Attorney",
  "Trademark Attorney",
  "Litigation Support Specialist",

  // ── Education ──
  "Teacher",
  "Elementary School Teacher",
  "Middle School Teacher",
  "High School Teacher",
  "Special Education Teacher",
  "ESL Teacher",
  "Substitute Teacher",
  "Teaching Assistant",
  "Professor",
  "Associate Professor",
  "Assistant Professor",
  "Adjunct Professor",
  "Dean",
  "Principal",
  "School Administrator",
  "Guidance Counselor",
  "Librarian",
  "Instructional Designer",
  "Curriculum Developer",
  "Tutor",
  "Early Childhood Educator",

  // ── HR / Recruiting ──
  "HR Manager",
  "HR Director",
  "VP of HR",
  "HR Coordinator",
  "HR Generalist",
  "HR Specialist",
  "Recruiter",
  "Senior Recruiter",
  "Technical Recruiter",
  "Talent Acquisition Specialist",
  "Talent Acquisition Manager",
  "People Operations Manager",
  "Benefits Coordinator",
  "Compensation Analyst",
  "Training Specialist",
  "Learning and Development Manager",
  "Employee Relations Manager",
  "HR Business Partner",

  // ── Operations / Logistics ──
  "Operations Manager",
  "Operations Director",
  "COO",
  "Supply Chain Manager",
  "Logistics Manager",
  "Logistics Coordinator",
  "Warehouse Manager",
  "Procurement Manager",
  "Procurement Specialist",
  "Buyer",
  "Purchasing Agent",
  "Inventory Manager",
  "Demand Planner",
  "Supply Chain Analyst",
  "Fleet Manager",
  "Transportation Manager",
  "Facilities Manager",

  // ── Science / Research ──
  "Research Scientist",
  "Senior Research Scientist",
  "Research Associate",
  "Research Assistant",
  "Lab Manager",
  "Chemist",
  "Biologist",
  "Microbiologist",
  "Biochemist",
  "Biomedical Scientist",
  "Environmental Scientist",
  "Geologist",
  "Physicist",
  "Astronomer",
  "Materials Scientist",
  "Food Scientist",
  "Forensic Scientist",
  "Clinical Research Associate",

  // ── Skilled Trades / Labor ──
  "Electrician",
  "Master Electrician",
  "Plumber",
  "Welder",
  "Carpenter",
  "HVAC Technician",
  "Construction Manager",
  "Construction Worker",
  "Laborer",
  "Heavy Equipment Operator",
  "Mechanic",
  "Auto Technician",
  "Diesel Mechanic",
  "Aircraft Mechanic",
  "Machinist",
  "CNC Operator",
  "Tool and Die Maker",
  "Painter",
  "Roofer",
  "Landscaper",
  "General Contractor",
  "Project Superintendent",

  // ── Customer Service / Support ──
  "Customer Service Representative",
  "Customer Support Specialist",
  "Support Manager",
  "Technical Support Engineer",
  "Help Desk Technician",
  "IT Support Specialist",
  "Call Center Agent",
  "Call Center Manager",
  "Client Services Manager",
  "Concierge",

  // ── Hospitality / Food Service ──
  "Chef",
  "Sous Chef",
  "Line Cook",
  "Restaurant Manager",
  "General Manager",
  "Hotel Manager",
  "Front Desk Agent",
  "Housekeeper",
  "Bartender",
  "Server",
  "Barista",
  "Event Coordinator",
  "Event Planner",
  "Wedding Planner",

  // ── Real Estate ──
  "Real Estate Agent",
  "Real Estate Broker",
  "Property Manager",
  "Real Estate Developer",
  "Appraiser",
  "Mortgage Loan Officer",
  "Title Examiner",

  // ── Media / Journalism ──
  "Journalist",
  "Reporter",
  "Editor",
  "Managing Editor",
  "News Anchor",
  "Producer",
  "Broadcaster",
  "Podcaster",
  "Writer",
  "Author",
  "Publishing Manager",

  // ── Fitness / Wellness ──
  "Personal Trainer",
  "Fitness Instructor",
  "Yoga Instructor",
  "Nutritionist",
  "Dietitian",
  "Massage Therapist",
  "Wellness Coach",
  "Spa Manager",

  // ── Government / Nonprofit ──
  "Policy Analyst",
  "Program Officer",
  "Grant Writer",
  "Fundraising Manager",
  "Development Director",
  "Executive Director",
  "Nonprofit Manager",
  "Urban Planner",
  "City Manager",
  "Firefighter",
  "Police Officer",

  // ── Other ──
  "Technical Writer",
  "Medical Writer",
  "Grant Writer",
  "Translator",
  "Interpreter",
  "Executive Assistant",
  "Administrative Assistant",
  "Office Manager",
  "Administrative Coordinator",
  "Data Entry Clerk",
  "Receptionist",
  "Virtual Assistant",
  "Business Analyst",
  "Management Consultant",
  "Strategy Consultant",
];

export default function NewScanPage() {
  const router = useRouter();
  const supabase = createClient();
  const [resumeText, setResumeText] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredTitles = JOB_TITLES.filter((t) =>
    t.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectTitle = (title: string) => {
    setJobTitle(title);
    setSearchQuery(title);
    setSearchOpen(false);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (resumeText.length < 50) {
      setError("Resume must be at least 50 characters");
      return;
    }
    const effectiveTitle = jobTitle || searchQuery.trim();
    if (!effectiveTitle) {
      setError("Please enter or select a job title");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({
          resumeText,
          jobTitle: effectiveTitle,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Something went wrong");
        setLoading(false);
        return;
      }

      router.push(`/results?scanId=${data.scanId}`);
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-10">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">New Scan</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Paste your resume and select a job title to get an ATS analysis.
        </p>
      </div>

      <UsageCounter />

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <FileText className="size-4" />
              Resume
            </CardTitle>
            <CardDescription>
              Paste your resume text or upload a PDF
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Tabs defaultValue="paste">
              <TabsList>
                <TabsTrigger value="paste" className="flex items-center gap-2">
                  <FileText className="size-3.5" />
                  Paste
                </TabsTrigger>
                <TabsTrigger value="upload" className="flex items-center gap-2">
                  <Upload className="size-3.5" />
                  Upload PDF
                </TabsTrigger>
              </TabsList>
              <TabsContent value="paste" className="mt-4">
                <Textarea
                  placeholder="Paste your full resume text here..."
                  className="min-h-48"
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                />
              </TabsContent>
              <TabsContent value="upload" className="mt-4">
                <FileUpload onTextExtracted={setResumeText} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Search className="size-4" />
              Job Title
            </CardTitle>
            <CardDescription>
              Search and select a job title — we&apos;ll generate a realistic job
              description automatically
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div ref={searchRef}>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search job titles..."
                  className="flex h-10 w-full rounded-md border border-input bg-background pl-9 pr-8 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setSearchOpen(true);
                  }}
                  onFocus={() => setSearchOpen(true)}
                />
                {searchQuery && (
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    onClick={() => {
                      setSearchQuery("");
                      setJobTitle("");
                    }}
                  >
                    <X className="size-4" />
                  </button>
                )}
              </div>

              {searchOpen && filteredTitles.length > 0 && (
                <div className="mt-1 max-h-60 overflow-auto rounded-md border border-border bg-popover p-1 shadow-lg">
                  {filteredTitles.map((title) => (
                    <button
                      key={title}
                      type="button"
                      className={`flex w-full items-center gap-2 rounded-sm px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground ${
                        jobTitle === title ? "bg-accent/50" : ""
                      }`}
                      onClick={() => handleSelectTitle(title)}
                    >
                      {jobTitle === title && (
                        <Check className="size-3.5 text-primary" />
                      )}
                      {jobTitle !== title && (
                        <span className="size-3.5" />
                      )}
                      {title}
                    </button>
                  ))}
                </div>
              )}

              {searchOpen && searchQuery && filteredTitles.length === 0 && (
                <button
                  type="button"
                  className="mt-1 w-full rounded-md border border-border bg-popover p-3 text-center text-sm text-muted-foreground shadow-lg transition-colors hover:bg-accent hover:text-accent-foreground"
                  onClick={() => {
                    setJobTitle(searchQuery);
                    setSearchOpen(false);
                  }}
                >
                  Use &ldquo;{searchQuery}&rdquo; as job title
                </button>
              )}
            </div>
          </CardContent>
        </Card>

        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}

        <Button type="submit" size="lg" className="w-full" disabled={loading}>
          {loading ? "Analyzing..." : "Analyze Match"}
        </Button>
      </form>
    </div>
  );
}
