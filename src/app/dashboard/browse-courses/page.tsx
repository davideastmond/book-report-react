"use client";
import { CourseSessionClient } from "@/clients/course-session-client";
import { ClassesSessionsList } from "@/components/classes-sessions/classes-sessions-list/Classes-sessions-list";
import { CourseSessionInfo } from "@/lib/types/db/course-session-info";
import { useEffect, useState } from "react";

export default function BrowseCoursesPage() {
  const [courseSessions, setCourseSessions] = useState<CourseSessionInfo[]>([]);

  useEffect(() => {
    fetchCourseSessions();
  }, []);

  async function fetchCourseSessions() {
    const data = await CourseSessionClient.fetchAvailableCourses();
    setCourseSessions(data);
  }
  return (
    <div>
      <ClassesSessionsList classesSessions={courseSessions} linkable />
    </div>
  );
}
