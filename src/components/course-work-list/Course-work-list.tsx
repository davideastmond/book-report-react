"use client";
import { AcademicTaskWithWeighting } from "@/lib/types/course-work/definitions";
import { useRouter } from "next/navigation";

export function CourseWorkList({
  courseWork,
  linkable = true,
}: {
  courseWork: AcademicTaskWithWeighting[];
  linkable?: boolean;
}) {
  const router = useRouter();
  return (
    <table className="table-auto w-full">
      <thead className="text-left">
        <tr>
          <th>Name</th>
          <th>Description</th>
          <th>Type</th>
          <th>Gr. P%</th>
          <th>Due Date</th>
        </tr>
      </thead>
      <tbody>
        {courseWork.map((work, index) => (
          <tr
            key={work.id}
            className={`${
              linkable && "hover:cursor-pointer "
            } hover:bg-list-hover/20 ${
              index % 2 === 0 ? "bg-slate-400/10" : "bg-background"
            }`}
            onClick={() => {
              if (linkable) {
                router.push(
                  `/dashboard/courses-sessions/${work.courseSessionId}/admin/course-work/${work.id}/edit`
                );
              }
            }}
          >
            <td className="p-2">{work.name}</td>
            <td className="p-2">{work.description}</td>
            <td className="p-2 font-thin">{work.taskType}</td>
            <td>
              {work.gradeWeightId ? (
                <p>
                  {work.gradeWeightName}({work.gradeWeightPercentage}%)
                </p>
              ) : (
                <p className="text-amber-400">N.A</p>
              )}
            </td>
            <td className="p-2">
              {work.dueDate
                ? new Date(work.dueDate).toLocaleDateString()
                : "N/A"}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
