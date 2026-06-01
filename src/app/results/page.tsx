import { Suspense } from "react";
import { AnalysisSkeleton } from "@/components/AnalysisSkeleton";
import { ResultsContent } from "./ResultsContent";

export default function ResultsPage() {
  return (
    <Suspense fallback={<AnalysisSkeleton />}>
      <ResultsContent />
    </Suspense>
  );
}
