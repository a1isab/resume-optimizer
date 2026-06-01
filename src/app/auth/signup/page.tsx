"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { signupSchema, type SignupValues } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { APP_NAME } from "@/lib/constants";
import { Mail, Loader2 } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const supabase = createClient();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [values, setValues] = useState<SignupValues>({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const parsed = signupSchema.safeParse(values);
    if (!parsed.success) {
      setError(parsed.error.issues[0].message);
      return;
    }

    setLoading(true);
    const { error: authError } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: { data: { name: values.name } },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    setLoading(false);
    setShowVerification(true);
  };

  return (
    <>
      <div className="flex flex-1 items-center justify-center px-4 py-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <Card className="w-full max-w-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Create your account</CardTitle>
            <CardDescription>
              Start optimizing your resume with {APP_NAME}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="Your name"
                  value={values.name}
                  onChange={(e) =>
                    setValues({ ...values, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={values.email}
                  onChange={(e) =>
                    setValues({ ...values, email: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={values.password}
                  onChange={(e) =>
                    setValues({ ...values, password: e.target.value })
                  }
                />
              </div>
              {error && (
                <p className="text-sm text-destructive animate-in fade-in duration-200">
                  {error}
                </p>
              )}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="size-4 animate-spin" />
                    Creating account...
                  </span>
                ) : (
                  "Try Free"
                )}
              </Button>
            </form>
            <p className="mt-4 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="font-medium text-primary hover:underline"
              >
                Log in
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>

      <Dialog open={showVerification} onOpenChange={setShowVerification}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="items-center text-center gap-3 pt-4">
            <div className="flex size-14 items-center justify-center rounded-full bg-primary/10">
              <Mail className="size-7 text-primary" />
            </div>
            <DialogTitle className="text-lg">Check your email</DialogTitle>
            <DialogDescription className="text-sm leading-relaxed">
              We sent a confirmation link to{" "}
              <span className="font-medium text-foreground">{values.email}</span>
              . Click the link to activate your account, then log in.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2 pb-4">
            <Button
              className="w-full"
              onClick={() => {
                setShowVerification(false);
                router.push("/auth/login");
              }}
            >
              Got it
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              Didn&apos;t get it? Check spam or{" "}
              <button
                type="button"
                className="font-medium text-primary hover:underline"
                onClick={() => {
                  setShowVerification(false);
                  setValues({ ...values, password: "" });
                }}
              >
                try again
              </button>
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
