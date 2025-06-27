"use client";
import { CourseSessionClient } from "@/clients/course-session-client";
import { CoursesSessionsList } from "@/components/courses-sessions/courses-sessions-list/Courses-sessions-list";
import { CourseSessionInfo } from "@/lib/types/db/course-session-info";
import { useEffect, useState } from "react";

export default function BrowseCoursesPage() {
  const [courseSessions, setCourseSessions] = useState<CourseSessionInfo[]>([]);
  const [showCompleted, setShowCompleted] = useState(false);
  const [isBusy, setIsBusy] = useState(false);
  useEffect(() => {
    fetchCourseSessions(showCompleted);
  }, [showCompleted]);

  async function fetchCourseSessions(showCompleted: boolean = false) {
    try {
      setIsBusy(true);
      const data = await CourseSessionClient.fetchAvailableCourses(
        showCompleted
      );
      setCourseSessions(data);
    } catch (error) {
      console.error((error as Error).message);
    } finally {
      setIsBusy(false);
    }
  }
  return (
    <div>
      <div className="my-10 flex pl-1">
        <input
          id="showCompleted"
          name="showCompleted"
          type="checkbox"
          className="customStyledCheckbox mr-4"
          checked={showCompleted}
          disabled={isBusy}
          onChange={() => {
            setShowCompleted(!showCompleted);
          }}
        />
        <label htmlFor="showCompleted" className="font-thin">
          Show All Courses
        </label>
      </div>
      <CoursesSessionsList coursesSessions={courseSessions} linkable />
    </div>
  );
}
