"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "../../src/lib/supabase/client";
import { signupSchema, type SignupValues } from "../../src/lib/validations";
import { Button } from "../../src/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../src/components/ui/card";
import { Input } from "../../src/components/ui/input";
import { Label } from "../../src/components/ui/label";
import { APP_NAME } from "../../src/lib/constants";

export default function SignupPage() {
  const router = useRouter();
  const supabase = createClient();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
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
    const { data: authData, error: authError } =
      await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: { data: { name: values.name } },
      });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    if (authData.user) {
      const supabaseAdmin = createClient();
      await supabaseAdmin.from("users").insert({
        id: authData.user.id,
        email: values.email,
        name: values.name,
        plan: "free",
        scan_count: 0,
      });
    }

    router.push("/dashboard");
    router.refresh();
  };

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-20">
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
              <p className="text-sm text-destructive">{error}</p>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating account..." : "Try Free"}
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
  );
}
