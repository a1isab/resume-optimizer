"use client";

import { useState } from "react";
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
import { Upload, FileText } from "lucide-react";

export default function NewScanPage() {
  const router = useRouter();
  const supabase = createClient();
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (resumeText.length < 50) {
      setError("Resume must be at least 50 characters");
      return;
    }
    if (jobDescription.length < 50) {
      setError("Job description must be at least 50 characters");
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
        body: JSON.stringify({ resumeText, jobDescription }),
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
          Paste your resume and the job description to get an ATS analysis.
        </p>
      </div>

      <UsageCounter />

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
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

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              Job Description
            </CardTitle>
            <CardDescription>
              Paste the job description you&apos;re applying to
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Paste the full job description here..."
              className="min-h-40"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />
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
