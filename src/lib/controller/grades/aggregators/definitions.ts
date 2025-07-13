export type AggregatedCourseAssignmentData = {
  studentId: string | null;
  studentFirstName: string | null;
  studentLastName: string | null;
  assignments: AggregatedCourseAssignment[];
};

export type AggregatedCourseAssignment = {
  academicTaskId: string | null;
  academicTaskName: string | null;
  academicTaskType: string | null;
  grade: number | null; // null if not graded
};
