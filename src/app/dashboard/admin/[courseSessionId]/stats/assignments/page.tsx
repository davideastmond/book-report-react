"use client";

import { AssignmentsOverview } from "@/components/assignments-overview/Assignments-overview";
import { useAdminAuthorized } from "app/hooks/use-admin-authorized";
import { useParams } from "next/navigation";

export default function AssignmentsOverviewPage() {
  const { isAdminAuthorized } = useAdminAuthorized();
  const params = useParams<{ courseSessionId: string }>();

  if (!isAdminAuthorized) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-lg">You do not have permission to view this page.</p>
      </div>
    );
  }

  return (
    <div className="mt-10">
      <AssignmentsOverview courseSessionId={params.courseSessionId} />
    </div>
  );
}
