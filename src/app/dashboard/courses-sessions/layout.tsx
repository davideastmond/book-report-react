import { CourseSessionsNavToolbar } from "@/components/nav/admin/course-sessions-nav-toolbar/Course-sessions-nav-toolbar";

export default function CoursesSessionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <CourseSessionsNavToolbar />
      {children}
    </div>
  );
}
