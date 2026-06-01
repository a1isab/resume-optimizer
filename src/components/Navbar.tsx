"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/lib/constants";
import type { User } from "@supabase/supabase-js";
import { Menu, X } from "lucide-react";

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ?? null);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => listener?.subscription.unsubscribe();
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight text-foreground"
        >
          {APP_NAME}
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link
            href="/"
            className={`text-sm transition-colors hover:text-foreground/80 ${
              pathname === "/" ? "text-foreground" : "text-muted-foreground"
            }`}
          >
            Home
          </Link>
          <Link
            href="/pricing"
            className={`text-sm transition-colors hover:text-foreground/80 ${
              pathname === "/pricing"
                ? "text-foreground"
                : "text-muted-foreground"
            }`}
          >
            Pricing
          </Link>
          {!loading && user ? (
            <>
              <Link
                href="/dashboard"
                className={`text-sm transition-colors hover:text-foreground/80 ${
                  pathname.startsWith("/dashboard")
                    ? "text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                Dashboard
              </Link>
              <Link
                href="/account"
                className={`text-sm transition-colors hover:text-foreground/80 ${
                  pathname === "/account"
                    ? "text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                Account
              </Link>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Log out
              </Button>
            </>
          ) : (
            !loading && (
              <>
                <Link href="/auth/login">
                  <Button variant="ghost" size="sm">
                    Log in
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button size="sm">Try Free</Button>
                </Link>
              </>
            )
          )}
        </nav>

        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setOpen(!open)}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </Button>
      </div>

      {open && (
        <div className="border-t border-border/40 px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-3">
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="text-sm text-muted-foreground"
            >
              Home
            </Link>
            <Link
              href="/pricing"
              onClick={() => setOpen(false)}
              className="text-sm text-muted-foreground"
            >
              Pricing
            </Link>
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setOpen(false)}
                  className="text-sm text-muted-foreground"
                >
                  Dashboard
                </Link>
                <Link
                  href="/account"
                  onClick={() => setOpen(false)}
                  className="text-sm text-muted-foreground"
                >
                  Account
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setOpen(false);
                    handleLogout();
                  }}
                >
                  Log out
                </Button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  onClick={() => setOpen(false)}
                  className="text-sm text-muted-foreground"
                >
                  Log in
                </Link>
                <Link href="/auth/signup" onClick={() => setOpen(false)}>
                  <Button size="sm" className="w-full">
                    Try Free
                  </Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
