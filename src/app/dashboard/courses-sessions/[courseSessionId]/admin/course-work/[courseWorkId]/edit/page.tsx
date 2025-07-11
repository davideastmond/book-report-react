"use client";
import { CourseWorkCreateUpdateForm } from "@/components/course-work-create-update/Course-work-create-update-form";
import { useAdminAuthorized } from "app/hooks/use-admin-authorized";
import { useParams } from "next/navigation";

// This page allows admins and teachers to edit course work parameters for a specific course session.
export default function EditCourseWorkPage() {
  const params = useParams<{
    courseSessionId: string;
    courseWorkId: string;
  }>();

  const { isAdminAuthorized } = useAdminAuthorized();
  if (!isAdminAuthorized) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-lg">You do not have permission to view this page.</p>
      </div>
    );
  }
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
