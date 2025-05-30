"use client";
import { CourseWorkCreateUpdateForm } from "@/components/course-work-create-update/Course-work-create-update-form";
import { useParams } from "next/navigation";

export default function NewCourseWorkPage() {
  const params = useParams<{ courseSessionId: string }>();
  return (
    <div>
      <h1 className="text-3xl py-4">New Course Work</h1>
      <CourseWorkCreateUpdateForm courseSessionId={params.courseSessionId} />
    </div>
  );
}
