import { Badge } from "@/components/ui/badge";

interface KeywordBadgesProps {
  matched: string[];
  missing: string[];
}

export function KeywordBadges({ matched, missing }: KeywordBadgesProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      <div>
        <h3 className="mb-3 text-sm font-semibold text-emerald-500">
          Matched Keywords
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {matched.length === 0 && (
            <p className="text-sm text-muted-foreground">None found</p>
          )}
          {matched.map((kw) => (
            <Badge
              key={kw}
              variant="outline"
              className="border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
            >
              {kw}
            </Badge>
          ))}
        </div>
      </div>
      <div>
        <h3 className="mb-3 text-sm font-semibold text-red-500">
          Missing Keywords
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {missing.length === 0 && (
            <p className="text-sm text-muted-foreground">None found</p>
          )}
          {missing.map((kw) => (
            <Badge
              key={kw}
              variant="outline"
              className="border-red-500/30 bg-red-500/10 text-red-400"
            >
              {kw}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
