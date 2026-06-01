import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export function AnalysisSkeleton() {
  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-10">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-20 w-full" />
      <div className="flex justify-center">
        <Skeleton className="size-44 rounded-full" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="space-y-2 p-4">
            <Skeleton className="h-4 w-32" />
            <div className="flex flex-wrap gap-1.5">
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-24 rounded-full" />
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-2 p-4">
            <Skeleton className="h-4 w-32" />
            <div className="flex flex-wrap gap-1.5">
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-24 rounded-full" />
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="space-y-3">
        <Skeleton className="h-4 w-36" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    </div>
  );
}
