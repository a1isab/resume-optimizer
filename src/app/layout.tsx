import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter_Tight } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navbar } from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const interTight = Inter_Tight({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

export const metadata: Metadata = {
  title: "ResumeAI - Fix Your Resume for the AI Screening",
  description:
    "Optimize your resume for ATS systems. Get a match score, find missing keywords, and rewrite weak bullet points with AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${interTight.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-noise">
        <TooltipProvider>
          <Navbar />
          <main className="flex-1 flex flex-col">{children}</main>
        </TooltipProvider>
      </body>
    </html>
  );
}
