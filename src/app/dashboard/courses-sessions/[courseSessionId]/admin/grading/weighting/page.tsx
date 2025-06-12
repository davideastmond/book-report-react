"use client";
import { GradeWeightingComponentMain } from "@/components/grade-weighting/Grade-Weighting-component-Main";
import { CourseSessionsNavToolbar } from "@/components/nav/admin/course-sessions-nav-toolbar/Course-sessions-nav-toolbar";
import { useParams } from "next/navigation";

export default function GradeWeightingPage() {
  const params = useParams<{
    courseSessionId: string;
  }>();
  return (
    <div>
      <CourseSessionsNavToolbar courseSessionId={params.courseSessionId} />
      <h1 className="text-3xl">Grade Weighting Page</h1>
      <GradeWeightingComponentMain courseSessionId={params.courseSessionId} />
    </div>
  );
}
