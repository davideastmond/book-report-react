import { GradesOverviewComponent } from "@/components/grade-components/Grades-overview";
import { GradesNavMain } from "@/components/nav/student/Grades-nav-main";

export default function StudentGradesPage() {
  return (
    <div>
      <GradesNavMain />
      <GradesOverviewComponent />
    </div>
  );
}
