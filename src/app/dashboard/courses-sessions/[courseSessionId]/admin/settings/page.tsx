"use client";

import { CourseSessionClient } from "@/clients/course-session-client";
import { Spinner } from "@/components/spinner/Spinner";
import { CourseSessionInfo } from "@/lib/types/db/course-session-info";
import { useAdmin } from "app/hooks/use-admin";
import { useAdminAuthorized } from "app/hooks/use-admin-authorized";
import { useToast } from "app/hooks/use-toast";
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
  const [sessionDateFormErrors, setSessionDateFormErrors] = useState<{
    sessionStart: string | null;
    sessionEnd: string | null;
  }>({ sessionStart: null, sessionEnd: null });

  const [isBusy, setIsBusy] = useState(false);
  const { status } = useSession();
  const router = useRouter();

  const { isAdminEditable } = useAdmin(
    courseSession?.courseSessionId as string
  );
  const { isAdminAuthorized } = useAdminAuthorized();
  const {
    showToast: showDescriptionUpdatedToast,
    ToastElement: DescriptionUpdatedToast,
  } = useToast();

  const {
    showToast: showCourseSessionDatesUpdatedToast,
    ToastElement: CourseSessionDatesUpdatedToast,
  } = useToast();

  useEffect(() => {
    if (!isAdminAuthorized) return;
    fetchCourseSessionById();
  }, [isAdminAuthorized]);

  useEffect(() => {
    if (isAdminAuthorized) {
      loadPrepopulatedData();
    }
  }, [courseSession, isAdminAuthorized]);

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

  function loadPrepopulatedData() {
    if (!courseSession) return;
    const sessionStartInput = document.getElementById(
      "sessionStart"
    ) as HTMLInputElement | null;
    const sessionEndInput = document.getElementById(
      "sessionEnd"
    ) as HTMLInputElement | null;

    const courseDescriptionInput = document.getElementById(
      "description"
    ) as HTMLTextAreaElement | null;

    if (sessionStartInput) {
      sessionStartInput.value = courseSession.sessionStart
        ? new Date(courseSession.sessionStart)?.toISOString()?.split("T")[0]
        : "";
    }

    if (sessionEndInput) {
      sessionEndInput.value = courseSession.sessionEnd
        ? new Date(courseSession.sessionEnd)?.toISOString()?.split("T")[0]
        : "";
    }
    if (courseDescriptionInput) {
      courseDescriptionInput!.value = courseSession.description || "";
    }
  }

  async function handleUpdateSessionDescription(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();
    setApiError(null);
    const formData = new FormData(e.currentTarget);
    const description = formData.get("description") as string;

    try {
      setIsBusy(true);
      await CourseSessionClient.patchCourseSession(params.courseSessionId, {
        description: description.trim(),
      });
      setIsBusy(false);
      await fetchCourseSessionById();
      showDescriptionUpdatedToast(
        "Course session description updated successfully."
      );
    } catch (error) {
      setApiError(
        "Error updating course session dates: " + (error as Error).message
      );
    }
  }
  async function handleUpdateSessionDates(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSessionDateFormErrors({ sessionStart: null, sessionEnd: null });
    setApiError(null);
    const formData = new FormData(e.currentTarget);
    const sessionStart = formData.get("sessionStart") as string;
    const sessionEnd = formData.get("sessionEnd") as string;

    if (!sessionStart || !sessionEnd) {
      setSessionDateFormErrors({
        sessionStart: "Session start date is required.",
        sessionEnd: "Session end date is required.",
      });
      return;
    }

    if (new Date(sessionStart) >= new Date(sessionEnd)) {
      setSessionDateFormErrors({
        sessionStart: "Session start must be before the end date.",
        sessionEnd: "Session end must be after the start date.",
      });
      return;
    }

    try {
      setIsBusy(true);
      await CourseSessionClient.patchCourseSession(params.courseSessionId, {
        sessionStart: new Date(sessionStart),
        sessionEnd: new Date(sessionEnd),
      });
      setIsBusy(false);
      await fetchCourseSessionById();
      showCourseSessionDatesUpdatedToast(
        "Course session dates updated successfully."
      );
    } catch (error) {
      setApiError(
        "Error updating course session dates: " + (error as Error).message
      );
    }
  }

  async function handleMarkSessionCourseComplete() {
    setApiError(null);
    try {
      setIsBusy(true);
      await CourseSessionClient.markCourseSessionAsCompleted(
        params.courseSessionId
      );
      setIsBusy(false);
      await fetchCourseSessionById();
    } catch (error) {
      setApiError((error as Error).message);
    }
  }

  if (status === "unauthenticated") {
    router.replace("/login");
    return null;
  }

  if (!isAdminAuthorized) {
    if (isAdminAuthorized === null) return <Spinner />;
    router.replace("/dashboard");
    return null;
  }

  return (
    <div>
      <h1 className="text-3xl">Course Session Settings</h1>
      <section>
        <p>
          {courseSession?.courseCode} - {courseSession?.courseName}
        </p>
      </section>
      <section className="p-4 mt-10">
        <h2 className="text-2xl">Course Description</h2>
        <article>
          <p>This description appears in the course catalog and syllabus.</p>
          <form
            onSubmit={handleUpdateSessionDescription}
            data-testid="update-session-description-form"
          >
            <div className="mt-4">
              <label htmlFor="description">Description:</label>
              <div>
                <textarea
                  id="description"
                  name="description"
                  className="w-full p-2 responsiveStyle"
                  autoComplete="off"
                  rows={4}
                  placeholder="Description of the class session"
                  maxLength={500}
                  disabled={!isAdminEditable}
                ></textarea>
              </div>
            </div>
            <div>
              <button
                type="submit"
                className="flatStyle bg-green-900 responsiveStyle"
                data-testid="update-session-description-button"
              >
                Update
              </button>
            </div>
          </form>
          <div>
            <DescriptionUpdatedToast />
          </div>
        </article>
      </section>
      <section className="p-4 mt-10">
        <h2 className="text-2xl">Session Dates</h2>
        <article>
          <p>Update when the session starts and ends</p>
          <form onSubmit={handleUpdateSessionDates}>
            <div className="mt-4">
              <label htmlFor="sessionStart">* Starts:</label>
              <div className="max-w-[300px]">
                <input
                  type="date"
                  id="sessionStart"
                  name="sessionStart"
                  className="w-full p-2"
                  autoComplete="off"
                  data-lpignore="true"
                  onKeyDown={() => false}
                  disabled={!isAdminEditable}
                  required
                ></input>
                {sessionDateFormErrors.sessionStart && (
                  <p className="text-red-500 text-sm">
                    {sessionDateFormErrors.sessionStart}
                  </p>
                )}
              </div>
            </div>
            <div className="mt-4">
              <label htmlFor="sessionEnd">* Ends:</label>
              <div className="max-w-[300px]">
                <input
                  type="date"
                  id="sessionEnd"
                  name="sessionEnd"
                  className="w-full p-2"
                  autoComplete="off"
                  data-lpignore="true"
                  disabled={!isAdminEditable}
                  required
                  onKeyDown={() => false}
                ></input>
                {sessionDateFormErrors.sessionEnd && (
                  <p className="text-red-500 text-sm">
                    {sessionDateFormErrors.sessionEnd}
                  </p>
                )}
              </div>
            </div>
            <div>
              <button
                type="submit"
                name="update-form"
                className="flatStyle bg-green-900 responsiveStyle"
                data-testid="update-session-dates-button"
              >
                Update
              </button>
            </div>
          </form>
          <div>
            <CourseSessionDatesUpdatedToast />
          </div>
        </article>
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
        {isAdminAuthorized && (
          <>
            <input
              type="checkbox"
              id="isLocked"
              name="isLocked"
              checked={isLocked}
              onChange={toggleLockState}
              disabled={!isAdminEditable || isBusy}
              className="customStyledCheckbox responsiveStyle"
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
            course session. This will also allow students to see their final
            grades.
          </p>
          <p></p>
        </article>
        <div>
          {courseSession?.isCompleted && (
            <div>
              <p className="text-amber-300">This course is completed.</p>
            </div>
          )}
          {!courseSession?.isCompleted && (
            <button
              className="flatStyle flex justify-center"
              onClick={handleMarkSessionCourseComplete}
              disabled={!isAdminEditable || isBusy}
            >
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
