type AcademicTaskId = string;
type StudentId = string;

export type StudentGradeData = Record<StudentId, GradeData>;

export type GradeData = {
  percentageGrade?: number | null;
  letterGrade?: string | null;
  instructorFeedback?: string | null;
};

export type TableData = Record<AcademicTaskId, StudentGradeData>;
