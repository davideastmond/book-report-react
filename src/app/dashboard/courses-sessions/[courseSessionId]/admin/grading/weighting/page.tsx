"use client";
import { GradeWeightingComponentMain } from "@/components/grade-weighting/Grade-Weighting-component-Main";
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
      <h1 className="text-3xl">Grade Weighting Page</h1>
      <GradeWeightingComponentMain courseSessionId={params.courseSessionId} />
    </div>
  );
}
