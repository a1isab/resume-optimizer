import { z } from "zod/v4";

export const analyzeFormSchema = z.object({
  resumeText: z.string().min(50, "Resume must be at least 50 characters").max(50000),
  jobDescription: z.string().min(50, "Job description must be at least 50 characters").max(50000),
});

export type AnalyzeFormValues = z.infer<typeof analyzeFormSchema>;

export const loginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginValues = z.infer<typeof loginSchema>;

export const signupSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type SignupValues = z.infer<typeof signupSchema>;
