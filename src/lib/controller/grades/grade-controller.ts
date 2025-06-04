import { db } from "@/db/index";
import {
  academicGrade,
  course,
  courseSession,
  roster,
  user,
} from "@/db/schema";
import { GradeSummaryData } from "@/lib/types/grading/definitions";
import { and, avg, eq, gte, lte, sql } from "drizzle-orm";

export const GradeController = {
  getGradeSummaryByDate: async ({
    studentId,
    startDate,
    endDate = new Date(),
  }: {
    studentId: string;
    startDate: Date;
    endDate?: Date;
  }): Promise<GradeSummaryData[]> => {
    return db
      .select({
        studentFirstName: user.firstName,
        studentLastName: user.lastName,
        studentId: roster.studentId,
        courseName: course.name,
        courseCode: course.course_code,
        coursePercentageAverage: avg(academicGrade.percentageGrade),
        courseLetterGradeAverage: sql`avg(
          CASE
            WHEN academic_grade.letter_grade = 'a+' THEN 100
            WHEN academic_grade.letter_grade = 'a' THEN 85
            WHEN academic_grade.letter_grade = 'a-' THEN 80
            WHEN academic_grade.letter_grade = 'b+' THEN 79
            WHEN academic_grade.letter_grade = 'b' THEN 75
            WHEN academic_grade.letter_grade = 'b-' THEN 70
            WHEN academic_grade.letter_grade = 'c+' THEN 69
            WHEN academic_grade.letter_grade = 'c' THEN 65
            WHEN academic_grade.letter_grade = 'c-' THEN 60
            WHEN academic_grade.letter_grade = 'd+' THEN 59
            WHEN academic_grade.letter_grade = 'd' THEN 55
            WHEN academic_grade.letter_grade = 'd-' THEN 50
            ELSE 0
          END
        )`,
        isCourseCompleted: courseSession.isCompleted,
        sessionStart: courseSession.sessionStart,
        sessionEnd: courseSession.sessionEnd,
      })
      .from(roster)
      .where(eq(roster.studentId, studentId))
      .groupBy(
        course.course_code,
        course.name,
        roster.studentId,
        user.firstName,
        user.lastName,
        courseSession.isCompleted,
        courseSession.sessionStart,
        courseSession.sessionEnd
      )
      .innerJoin(academicGrade, eq(roster.studentId, academicGrade.userId))
      .innerJoin(
        courseSession,
        and(
          eq(courseSession.id, academicGrade.courseSessionId),
          gte(courseSession.sessionStart, startDate),
          lte(courseSession.sessionEnd, endDate)
        )
      )
      .innerJoin(course, eq(course.id, courseSession.courseId))
      .fullJoin(user, eq(user.id, roster.studentId));
  },
};
