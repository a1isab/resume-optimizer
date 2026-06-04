export type Plan = "free" | "pro";

export interface UserProfile {
  id: string;
  email: string;
  name: string | null;
  plan: Plan;
  scan_count: number;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  subscription_status: string;
  created_at: string;
  updated_at: string;
}

export interface WeakBullet {
  original: string;
  rewritten: string;
  why_weak: string;
}

export interface AnalysisResult {
  ats_score: number;
  matched_keywords: string[];
  missing_keywords: string[];
  weak_bullets: WeakBullet[];
  summary: string;
  critical_notes: string[];
}

export interface Scan {
  id: string;
  user_id: string;
  resume_text: string;
  job_description: string;
  job_title: string | null;
  ats_score: number | null;
  matched_keywords: string[] | null;
  missing_keywords: string[] | null;
  weak_bullets: WeakBullet[] | null;
  summary: string | null;
  critical_notes: string[] | null;
  created_at: string;
}
