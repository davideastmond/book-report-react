import { authOptions } from "@/auth/auth";
import { CourseSessionClient } from "@/clients/course-session-client";
import { GroupedCourseList } from "@/components/grouped-course-table/Grouped-course-list";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
export default async function CompletedCoursesSummaryPage() {
  const serverSession = await getServerSession(authOptions);

  const groupedCourses =
    await CourseSessionClient.fetchGroupedCourseSessionByCourse();

  if (!serverSession || !serverSession.user) {
    redirect("/login");
  }

  return <GroupedCourseList groupedCourses={groupedCourses} />;
}
