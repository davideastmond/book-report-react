"use client";
import { CourseWorkCreateUpdateForm } from "@/components/course-work-create-update/Course-work-create-update-form";
import { CourseSessionsNavToolbar } from "@/components/nav/admin/course-sessions-nav-toolbar/Course-sessions-nav-toolbar";
import { useParams } from "next/navigation";

// This page allows admins and teachers to edit course work parameters for a specific course session.
export default function EditCourseWorkPage() {
  const params = useParams<{
    courseSessionId: string;
    courseWorkId: string;
  }>();

  return (
    <div>
      <CourseSessionsNavToolbar courseSessionId={params.courseSessionId} />
      <CourseWorkCreateUpdateForm
        isEditing
        courseSessionId={params.courseSessionId}
        courseWorkId={params.courseWorkId}
      />
    </div>
  );
}
