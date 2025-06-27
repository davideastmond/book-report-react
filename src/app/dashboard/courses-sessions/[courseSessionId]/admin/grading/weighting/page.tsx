"use client";
import { GradeWeightingComponentMain } from "@/components/grade-weighting/Grade-Weighting-component-Main";
import { CourseSessionsNavToolbar } from "@/components/nav/admin/course-sessions-nav-toolbar/Course-sessions-nav-toolbar";
import { Spinner } from "@/components/spinner/Spinner";
import { useAdminAuthorized } from "app/hooks/use-admin-authorized";
import { useParams, useRouter } from "next/navigation";

export default function GradeWeightingPage() {
  const { isAdminAuthorized } = useAdminAuthorized();
  const router = useRouter();
  const params = useParams<{
    courseSessionId: string;
  }>();

  if (!isAdminAuthorized) {
    if (isAdminAuthorized === null) return <Spinner />;
    router.replace("/dashboard");
  }

  return (
    <div>
      <CourseSessionsNavToolbar courseSessionId={params.courseSessionId} />
      <h1 className="text-3xl">Grade Weighting Page</h1>
      <GradeWeightingComponentMain courseSessionId={params.courseSessionId} />
    </div>
  );
}
