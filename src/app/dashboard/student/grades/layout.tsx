import { GradesNavMain } from "@/components/nav/student/Grades-nav-main";

export default function StudentGradesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <GradesNavMain />
      {children}
    </>
  );
}
