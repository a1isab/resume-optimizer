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
  "Software Engineer",
  "Senior Software Engineer",
  "Staff Software Engineer",
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "DevOps Engineer",
  "Site Reliability Engineer",
  "Data Engineer",
  "Data Scientist",
  "Machine Learning Engineer",
  "AI Engineer",
  "Mobile Developer",
  "iOS Developer",
  "Android Developer",
  "Cloud Engineer",
  "Security Engineer",
  "Engineering Manager",
  "Product Manager",
  "Technical Product Manager",
  "Product Designer",
  "UX Designer",
  "UI Designer",
  "UX Researcher",
  "Data Analyst",
  "Business Intelligence Analyst",
  "Quantitative Analyst",
  "Project Manager",
  "Program Manager",
  "Scrum Master",
  "Tech Lead",
  "Solutions Architect",
  "QA Engineer",
  "SDET",
  "Systems Administrator",
  "Network Engineer",
  "Technical Writer",
  "Director of Engineering",
  "VP of Engineering",
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
    if (!jobTitle) {
      setError("Please select a job title");
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
          jobTitle,
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
            <div ref={searchRef} className="relative">
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
                <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-border bg-popover p-1 shadow-lg">
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
                <div className="absolute z-50 mt-1 w-full rounded-md border border-border bg-popover p-3 text-center text-sm text-muted-foreground shadow-lg">
                  No matching titles found
                </div>
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
