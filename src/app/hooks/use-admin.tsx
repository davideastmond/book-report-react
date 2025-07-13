"use client";
import { CourseSessionClient } from "@/clients/course-session-client";
import { CourseSessionDataAPIResponse } from "@/lib/types/db/course-session-info";
import { useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";

export function useAdmin(courseSessionId?: string) {
  const [courseSessionContext, setCourseSessionContext] =
    useState<CourseSessionDataAPIResponse | null>(null);

  const [isBusy, setIsBusy] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    if (!courseSessionId) return;
    if (session?.user && ["teacher", "admin"].includes(session.user?.role)) {
      fetchCourseSessionData();
    }
  }, [courseSessionId, session?.user]);

  const isStrictlyAdmin = useMemo(() => {
    return session?.user?.role === "admin";
  }, [session?.user?.role]);

  const isAdminEditable = useMemo(() => {
    if (!courseSessionId) return false;
    if (session?.user?.role === "admin") return true;
    if (
      session?.user?.role === "teacher" &&
      session.user.id === courseSessionContext?.courseSessionData.instructorId
    ) {
      return true;
    }
    return false;
  }, [courseSessionId, session?.user, courseSessionContext]);

  async function fetchCourseSessionData() {
    try {
      setIsBusy(true);
      const courseSessionData =
        await CourseSessionClient.fetchCourseSessionByIdAdmin(courseSessionId!);
      setCourseSessionContext(courseSessionData);
      setIsBusy(false);
    } catch (error) {
      console.error(
        "Error occurred in the use-admin hook - fetching course data:" +
          (error as Error).message
      );
    }
  }

  return { isBusy, isAdminEditable, isStrictlyAdmin };
}
