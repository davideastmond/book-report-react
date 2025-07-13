"use client";
import { CourseWorkCreateUpdateForm } from "@/components/course-work-create-update/Course-work-create-update-form";
import { useAdminAuthorized } from "app/hooks/use-admin-authorized";
import { useParams } from "next/navigation";

export default function NewCourseWorkPage() {
  const params = useParams<{ courseSessionId: string }>();
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
      <h1 className="text-3xl py-4">New Course Work</h1>
      <CourseWorkCreateUpdateForm courseSessionId={params.courseSessionId} />
    </div>
  );
}
