import { authOptions } from "@/auth/auth";
import { CourseSessionClient } from "@/clients/course-session-client";
import {
  CourseSessionInfo,
  CourseSessionsAPIResponse,
} from "@/lib/types/db/course-session-info";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { CoursesSessionsList } from "./courses-sessions-list/Courses-sessions-list";

type CoursesSessionsMainProps = {
  isAdmin?: boolean;
};
export async function CoursesSessionsMain({
  isAdmin,
}: CoursesSessionsMainProps) {
  const authUser = await getServerSession(authOptions);
  const fetchCourseSessions = async () => {
    console.log("isAdmin:", isAdmin);
    if (isAdmin && authUser) {
      return CourseSessionClient.fetchCourseSessionsAdmin(
        authUser.user!.id as string
      );
    }
    return CourseSessionClient.fetchCourseSessionsByStudent();
  };
  const courseSessions = await fetchCourseSessions();

  if (isAdmin) {
    return (
      <>
        <div className="mt-4 flex justify-end px-4">
          <Link href="/dashboard/courses-sessions/new" className="flatStyle">
            + New Course Session
          </Link>
        </div>
        <div className="flex p-4">
          <CoursesSessionsList
            coursesSessions={courseSessions as CourseSessionInfo[]}
            linkable
          />
        </div>
      </>
    );
  }
  return (
    <div className="flex p-4">
      <CoursesSessionsList
        coursesSessions={courseSessions as CourseSessionsAPIResponse}
        linkable
      />
    </div>
  );
}
