import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { FileText } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="flex flex-1 items-center justify-center px-4 py-20">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center py-16 text-center">
          <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
            <FileText className="size-7" />
          </div>
          <h2 className="text-xl font-semibold">No scans yet</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Start your first analysis to see how your resume stacks up.
          </p>
          <Link href="/dashboard/new">
            <Button className="mt-6">New Scan</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
