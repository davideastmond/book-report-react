import { AcademicTaskWithWeighting } from "@/lib/types/course-work/definitions";
import { Card, CardBody, Link } from "@heroui/react";

export function CourseWorkList({
  courseWork,
  linkable = true,
}: {
  courseWork: AcademicTaskWithWeighting[];
  linkable?: boolean;
}) {
  return (
    <div className="flex flex-col">
      {courseWork.map((work, index) => (
        <Link
          href={
            linkable
              ? `/dashboard/courses-sessions/${work.courseSessionId}/admin/course-work/${work.id}/edit`
              : "#"
          }
          key={work.id}
        >
          <Card
            key={work.id}
            className={`${
              linkable && "hover:cursor-pointer "
            } hover:bg-list-hover/20 w-full`}
          >
            <CardBody
              className={`${
                index % 2 === 0 ? "bg-slate-400/10" : "bg-background"
              }`}
            >
              <div className="flex flex-col">
                <p className="text-md font-bold">{work.name}</p>
                <p className="text-sm">{work.description}</p>
                <div className="flex gap-4 mt-2">
                  <p className="font-bold">
                    Type: <span className="font-thin">{work.taskType}</span>
                  </p>
                  <p className="font-bold">
                    Gr. P%:{" "}
                    {work.gradeWeightId ? (
                      <span className="font-thin">
                        {work.gradeWeightName}({work.gradeWeightPercentage}
                        %)
                      </span>
                    ) : (
                      <span className="text-amber-400">N.A</span>
                    )}
                  </p>
                  <p className="font-bold">
                    Due Date:{" "}
                    <span className="font-thin">
                      {work.dueDate
                        ? new Date(work.dueDate).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>
        </Link>
      ))}
    </div>
  );
}
