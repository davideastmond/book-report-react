"use client";
import { CourseSessionClient } from "@/clients/course-session-client";
import { CourseGradingMain } from "@/components/course-grading/Course-grading-main";
import { CourseSessionsNavToolbar } from "@/components/nav/admin/course-sessions-nav-toolbar/Course-sessions-nav-toolbar";
import { Spinner } from "@/components/spinner/Spinner";
import { CourseSessionDataAPIResponse } from "@/lib/types/db/course-session-info";
import { useAdminAuthorized } from "app/hooks/use-admin-authorized";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminGradingPage() {
  const params = useParams<{ courseSessionId: string }>();
  const [courseData, setCourseData] =
    useState<CourseSessionDataAPIResponse | null>(null);

  const { isAdminAuthorized } = useAdminAuthorized();
  const router = useRouter();

  useEffect(() => {
    if (!isAdminAuthorized) return;
    fetchCourseSessionData();
  }, [isAdminAuthorized]);

  async function fetchCourseSessionData() {
    try {
      const res = await CourseSessionClient.fetchCourseSessionByIdAdmin(
        params.courseSessionId
      );
      setCourseData(res);
    } catch (error) {
      console.error("Error fetching course session data:", error);
    }
  }

  if (!isAdminAuthorized) {
    if (isAdminAuthorized === null) return <Spinner />;
    return router.replace("/dashboard");
  }

  return (
    <div>
      <CourseSessionsNavToolbar courseSessionId={params.courseSessionId} />
      <h1 className="text-3xl">Admin Grading Page</h1>
      {courseData && <CourseGradingMain courseData={courseData} />}
    </div>
  );
}
