import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { WeakBullet } from "@/lib/types";

interface BulletRewritesProps {
  bullets: WeakBullet[];
}

export function BulletRewrites({ bullets }: BulletRewritesProps) {
  if (bullets.length === 0) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold">Rewritten Bullets</h3>
      {bullets.map((b, i) => (
        <Card
          key={i}
          className="overflow-hidden glass-card animate-fade-in-up"
          style={{ animationDelay: `${i * 60}ms` }}
        >
          {b.why_weak && (
            <div className="border-b border-border/50 bg-muted/30 px-4 py-1.5">
              <p className="text-xs text-muted-foreground">
                <span className="font-medium text-amber-400">Why weak:</span>{" "}
                {b.why_weak}
              </p>
            </div>
          )}
          <CardContent className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2">
            <div>
              <p className="mb-1 text-xs font-medium text-muted-foreground">
                Original
              </p>
              <p className="text-sm text-muted-foreground">
                {b.original}
              </p>
            </div>
            <div className="relative">
              <Separator
                orientation="horizontal"
                className="mb-3 sm:hidden"
              />
              <div className="hidden sm:absolute sm:-left-2 sm:top-0 sm:h-full sm:w-px sm:bg-border" />
              <p className="mb-1 text-xs font-medium text-primary">
                Rewritten
              </p>
              <p className="text-sm text-foreground">{b.rewritten}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
