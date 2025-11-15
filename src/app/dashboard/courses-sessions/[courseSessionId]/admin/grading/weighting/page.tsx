"use client";
import { GradeWeightTable } from "@/components/grade-weighting/Grade-Weight-table";
import { useAdminAuthorized } from "app/hooks/use-admin-authorized";
import { useParams } from "next/navigation";

export default function GradeWeightingPage() {
  const { isAdminAuthorized } = useAdminAuthorized();

  const params = useParams<{
    courseSessionId: string;
  }>();

  if (!isAdminAuthorized) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-lg">You do not have permission to view this page.</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl my-4">Weight Definitions</h1>
      <div>
        <GradeWeightTable courseSessionId={params.courseSessionId} />
      </div>
    </div>
  );
}
