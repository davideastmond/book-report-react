export type GroupedCourseInfo = {
  courseId: string | null;
  courseCode: string | null;
  courseName: string | null;
  courseSessionId: string | null;
  courseSessionStart: Date | null;
  courseSessionEnd: Date | null;
  courseSessionInstructorId: string | null;
  isCompleted: boolean | null;
  courseSessionInstructorFirstName: string | null;
  courseSessionInstructorLastName: string | null;
};
