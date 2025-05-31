"use client";

import { CourseSessionClient } from "@/clients/course-session-client";
import { CourseSessionsNavToolbar } from "@/components/nav/admin/course-sessions-nav-toolbar/Course-sessions-nav-toolbar";
import { CourseSessionInfo } from "@/lib/types/db/course-session-info";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CourseSessionSettingsPage() {
  const [isLocked, setIsLocked] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const params = useParams<{ courseSessionId: string }>();
  const [courseSession, setCourseSession] = useState<CourseSessionInfo | null>(
    null
  );
  const [isBusy, setIsBusy] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    fetchCourseSessionById();
  }, []);
  async function fetchCourseSessionById() {
    setIsBusy(true);
    const res = await CourseSessionClient.fetchCourseSessionByIdAdmin(
      params.courseSessionId
    );
    setCourseSession(res.courseSessionData);
    setIsBusy(false);

    setIsLocked(res.courseSessionData.isLocked || false);
  }

  async function toggleLockState() {
    setApiError(null);
    try {
      setIsBusy(true);
      await CourseSessionClient.toggleLockedStatusForCourseSession(
        params.courseSessionId as string
      );
      setIsBusy(false);
      await fetchCourseSessionById();
    } catch (error) {
      setApiError("Error toggling lock state: " + (error as Error).message);
    }
  }

  if (status === "unauthenticated") {
    router.replace("/login");
    return null;
  }

  if (["student"].includes(session?.user?.role as string)) {
    return null;
  }

  return (
    <div>
      <CourseSessionsNavToolbar courseSessionId={params.courseSessionId} />
      <h1 className="text-3xl">Course Session Settings</h1>
      <section>
        <p>
          {courseSession?.courseCode} - {courseSession?.courseName}
        </p>
      </section>
      <section className="p-4 mt-10">
        <h2 className="text-2xl">Locking</h2>
        <article>
          <p>This section controls whether a course is locked.</p>
          <p>
            Locking a course prevents students from enrolling or un-enrolling
            from this course session
          </p>
        </article>
        {["admin", "teacher"].includes(session?.user?.role as string) && (
          <>
            <input
              type="checkbox"
              id="isLocked"
              name="isLocked"
              checked={isLocked}
              onChange={toggleLockState}
              disabled={isBusy}
              className="customStyledCheckbox"
            />
            <label htmlFor="isLocked">Locked</label>
          </>
        )}
      </section>
      <section className="p-4 mt-10">
        <h2 className="text-2xl">Complete this course</h2>
        <article>
          <p>
            When grading is completed and ready to be official, close this by
            marking it as complete. This will prevent any further changes to the
            course session.
          </p>
          <p></p>
        </article>
        <div>
          {courseSession?.isCompleted && (
            <p className="text-amber-300">This course is completed.</p>
          )}
          {!courseSession?.isCompleted && (
            <button className="flatStyle" onClick={() => {}}>
              Complete this course
            </button>
          )}
        </div>
      </section>
      {apiError && (
        <div className="text-red-500 mt-4">
          <p>Error: {apiError}</p>
        </div>
      )}
    </div>
  );
}
