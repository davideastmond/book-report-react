"use client";
import { CourseWorkCreateForm } from "@/components/course-work-create/Course-work-create-form";
import { useParams } from "next/navigation";

export default function NewCourseWorkPage() {
  const params = useParams<{ courseSessionId: string }>();
  return (
    <div>
      <h1 className="text-3xl py-4">New Course Work</h1>
      <CourseWorkCreateForm courseSessionId={params.courseSessionId} />
    </div>
  );
}
