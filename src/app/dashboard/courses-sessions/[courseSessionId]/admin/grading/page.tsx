"use client";
import { CourseSessionClient } from "@/clients/course-session-client";
import { CourseGradingMain } from "@/components/course-grading/Course-grading-main";
import { CourseSessionDataAPIResponse } from "@/lib/types/db/course-session-info";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminGradingPage() {
  const params = useParams<{ courseSessionId: string }>();
  const [courseData, setCourseData] =
    useState<CourseSessionDataAPIResponse | null>(null);

  useEffect(() => {
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
    fetchCourseSessionData();
  }, []);

  return (
    <div>
      <h1 className="text-3xl">Admin Grading Page</h1>
      {courseData && <CourseGradingMain courseData={courseData} />}
    </div>
  );
}
