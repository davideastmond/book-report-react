"use client";

import { useAdminAuthorized } from "app/hooks/use-admin-authorized";
import { useParams, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { CourseSessionsStudentNavToolbar } from "../../student/Course-sessions-nav-toolbar";

export const CourseSessionsNavToolbar = () => {
  const { courseSessionId } = useParams<{
    courseSessionId: string;
  }>();

  const searchParams = useSearchParams();
  const idFromSearchParams = searchParams.get("id");

  const { isAdminAuthorized } = useAdminAuthorized();

  const computedCourseSessionId = useMemo(() => {
    if (courseSessionId) return courseSessionId;
    if (idFromSearchParams) return idFromSearchParams;
    return null;
  }, [courseSessionId, idFromSearchParams]);

  if (!isAdminAuthorized) {
    return <CourseSessionsStudentNavToolbar />;
  }

  if (!computedCourseSessionId) return null;

  return (
    <div className="bg-green-900 p-1 text-sm">
      <ul className="flex justify-start gap-12">
        <li>
          <a
            href={`/dashboard/courses-sessions/${computedCourseSessionId}/admin/course-work`}
            className="text-white hover:text-gray-300"
          >
            Exams and Course Work
          </a>
        </li>
        <li>
          <a
            href={`/dashboard/courses-sessions/${computedCourseSessionId}/admin/grading`}
            className="text-white hover:text-gray-300"
          >
            Grading
          </a>
        </li>
        <li>
          <a
            href={`/dashboard/courses-sessions/${computedCourseSessionId}/admin/grading/weighting`}
            className="text-white hover:text-gray-300"
          >
            Grade Weightings
          </a>
        </li>
        <li>
          <a
            href={`/dashboard/courses-sessions/${computedCourseSessionId}/admin/settings`}
            className="text-white hover:text-gray-300"
          >
            Settings
          </a>
        </li>
        <li>
          <a
            href={`/dashboard/courses-sessions/${computedCourseSessionId}/admin/final-grade-report`}
            className="text-white hover:text-gray-300"
          >
            Final Grade Report
          </a>
        </li>
        <li>
          <a
            href={`/dashboard/courses-sessions/view?id=${computedCourseSessionId}`}
            className="text-white hover:text-gray-300"
          >
            Main
          </a>
        </li>
      </ul>
    </div>
  );
};
