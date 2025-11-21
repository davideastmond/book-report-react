import { authOptions } from "@/auth/auth";
import { CourseSessionClient } from "@/clients/course-session-client";
import { GroupedCourseList } from "@/components/grouped-course-table/Grouped-course-list";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
export default async function CompletedCoursesSummaryPage() {
  const serverSession = await getServerSession(authOptions);
  if (!serverSession || !serverSession.user) {
    return redirect("/login");
  }

  try {
    const groupedCourses =
      await CourseSessionClient.fetchGroupedCourseSessionByCourse();

    return <GroupedCourseList groupedCourses={groupedCourses || []} />;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    if (errorMessage === "Unauthorized") {
      return redirect("/login");
    }
  }
}
