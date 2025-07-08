import { GradeSummaryData } from "../grading/student/definitions";

export type AdminStudentDataAPIResponse = {
  studentData: UserSummaryData;
  coursesData: CourseHistoryData[];
  gradesData: GradeSummaryData[];
};

export type UserSummaryData = {
  studentFirstName: string;
  studentLastName: string;
  studentId: string;
};

export type CourseHistoryData = {
  courseName: string;
  courseCode: string;
  courseSessionId: string;
  sessionStart: Date;
  sessionEnd: Date;
  isCompleted: boolean;
  studentFirstName: string;
  studentLastName: string;
  studentId: string;
};
