export type CourseSessionInfo = {
  courseId: string | null;
  courseName: string | null;
  courseCode: string | null;
  courseSessionId: string | null;
  sessionStart: Date | null;
  sessionEnd: Date | null;
  instructorId: string | null;
  instructorFirstName: string;
  instructorLastName: string;
  description: string | null;
  studentAllotment: number;
  allotmentCount: number;
};

export type EnrolledStudent = {
  studentId: string;
  studentFirstName: string;
  studentLastName: string;
  studentDob: Date | null;
  studentEmail: string | null;
};

export type CourseSessionDataAPIResponse = {
  courseSessionData: CourseSessionInfo;
  students: EnrolledStudent[];
  isEnrolled: boolean;
};
export type CourseSessionsAPIResponse = CourseSessionInfo[] | null;
