type AcademicTaskId = string;
type StudentId = string;

export type StudentGradeData = Record<StudentId, GradeData>;

export type GradeData = {
  percentageGrade?: number | null;
  letterGrade?: string | null;
  instructorFeedback?: string | null;
};

export type TableData = Record<AcademicTaskId, StudentGradeData>;

export type GradeControllerCourseAverageAPIResponse = CourseGradeAverage;

export type CourseGradeAverage = {
  courseAverage: number | string | null;
  studentId: string | null;
  studentFirstName: string | null;
  studentLastName: string | null;
  courseName: string | null;
  courseCode: string | null;
};

export type GradeSummaryData = {
  studentFirstName: string | null;
  studentLastName: string | null;
  studentId: string | null;
  courseName: string | null;
  courseCode: string | null;
  coursePercentageAverage: number | null;
  isCourseCompleted: boolean | null;
  sessionStart: Date | null;
  sessionEnd: Date | null;
  instructorFirstName: string | null;
  instructorLastName: string | null;
  courseSessionId: string | null;
};

export type WeighingTableData = {
  courseName: string | null;
  courseCode: string | null;
  courseSessionId: string | null;
  gradeWeightName: string | null;
  gradeWeightPercentage: number | null;
  gradeWeightId: string | null;
};

export type RawGradeReportData = {
  academicTaskId: string | null;
  academicTaskName: string | null;
  academicTaskType: string | null;
  courseName: string | null;
  courseSessionId: string | null;
  courseCode: string | null;
  studentId: string | null;
  studentFirstName: string | null;
  studentLastName: string | null;
  gradeWeightId: string | null;
  gradeWeightName: string | null;
  gradeWeightPercentage: number | null;
  percentageGrade: number | null;
  isCourseCompleted: boolean | null;
  sessionStart: Date | null;
  sessionEnd: Date | null;
  instructorFirstName: string | null;
  instructorLastName: string | null;
};
