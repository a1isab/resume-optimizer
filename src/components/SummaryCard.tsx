import { Card, CardContent } from "@/components/ui/card";

export function SummaryCard({ summary }: { summary: string }) {
  return (
    <Card className="border-l-4 border-l-primary glass-card">
      <CardContent className="p-4">
        <p className="text-sm leading-relaxed text-foreground">
          {summary}
        </p>
      </CardContent>
    </Card>
  );
}
