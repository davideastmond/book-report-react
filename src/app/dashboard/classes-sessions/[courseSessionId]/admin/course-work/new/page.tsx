import { ClassWorkCreateForm } from "@/components/class-work-create/Class-work-create-form";

export default function NewCourseWorkPage({
  params,
}: {
  params: { courseSessionId: string };
}) {
  return (
    <div>
      <h1 className="text-3xl py-4">New Course Work</h1>
      <ClassWorkCreateForm />
    </div>
  );
}
