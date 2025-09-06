"use client";
import { CourseSessionClient } from "@/clients/course-session-client";
import { CourseGradingMain } from "@/components/course-grading/Course-grading-main";
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
    router.replace("/dashboard");
    return null;
  }

  return (
    <div>
      <h1 className="text-3xl">Admin Grading Page</h1>
      {courseData && <CourseGradingMain courseData={courseData} />}
    </div>
  );
}
