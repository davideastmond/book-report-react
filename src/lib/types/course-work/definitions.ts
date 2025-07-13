import { AcademicTask } from "@/db/schema";

export type AcademicTaskWithWeighting = Partial<AcademicTask> & {
  gradeWeightPercentage: number | null;
  gradeWeightId: string | null;
  gradeWeightName: string | null;
};
