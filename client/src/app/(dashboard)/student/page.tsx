import type { Metadata } from "next";
import { StudentDashboard } from "@/components/modules/student/StudentDashboard";

export const metadata: Metadata = { title: "My submissions" };

export default function StudentPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">My submissions</h1>
        <p className="text-sm text-muted-foreground">Submit projects for review and follow their status.</p>
      </div>
      <StudentDashboard />
    </div>
  );
}
