import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export function AnalysisSkeleton() {
  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-10">
      <div className="animate-fade-in-up stagger-1">
        <Skeleton className="h-8 w-48 animate-shimmer rounded-md" />
      </div>
      <div className="animate-fade-in-up stagger-2">
        <Skeleton className="h-20 w-full animate-shimmer rounded-lg" />
      </div>
      <div className="flex justify-center animate-fade-in-up stagger-3">
        <Skeleton className="size-44 rounded-full animate-shimmer" />
      </div>
      <div className="grid grid-cols-2 gap-4 animate-fade-in-up stagger-4">
        <Card>
          <CardContent className="space-y-2 p-4">
            <Skeleton className="h-4 w-32 animate-shimmer rounded-md" />
            <div className="flex flex-wrap gap-1.5">
              <Skeleton className="h-6 w-20 rounded-full animate-shimmer" />
              <Skeleton className="h-6 w-24 rounded-full animate-shimmer" />
              <Skeleton className="h-6 w-16 rounded-full animate-shimmer" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-2 p-4">
            <Skeleton className="h-4 w-32 animate-shimmer rounded-md" />
            <div className="flex flex-wrap gap-1.5">
              <Skeleton className="h-6 w-20 rounded-full animate-shimmer" />
              <Skeleton className="h-6 w-24 rounded-full animate-shimmer" />
              <Skeleton className="h-6 w-16 rounded-full animate-shimmer" />
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="space-y-3 animate-fade-in-up stagger-5">
        <Skeleton className="h-4 w-36 animate-shimmer rounded-md" />
        <Skeleton className="h-24 w-full animate-shimmer rounded-lg" />
        <Skeleton className="h-24 w-full animate-shimmer rounded-lg" />
      </div>
    </div>
  );
}
