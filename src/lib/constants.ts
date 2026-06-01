export const APP_NAME = "ResumeAI";
export const APP_TAGLINE = "Fix Your Resume for the AI Screening";
export const FREE_SCAN_LIMIT = 3;
export const PRO_PRICE = 12;
export const PRO_PRICE_ID = process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID!;

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/pricing", label: "Pricing" },
] as const;

export const PROTECTED_ROUTES = ["/dashboard", "/results", "/account"];
