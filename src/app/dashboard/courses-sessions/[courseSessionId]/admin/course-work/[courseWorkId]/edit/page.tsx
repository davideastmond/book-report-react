"use client";
import { CourseWorkCreateUpdateForm } from "@/components/course-work-create-update/Course-work-create-update-form";
import { useParams } from "next/navigation";

// This page allows admins and teachers to edit course work parameters for a specific course session.
export default function EditCourseWorkPage() {
  const params = useParams<{
    courseSessionId: string;
    courseWorkId: string;
  }>();

  return (
    <div>
      <CourseWorkCreateUpdateForm
        isEditing
        courseSessionId={params.courseSessionId}
        courseWorkId={params.courseWorkId}
      />
    </div>
  );
}
