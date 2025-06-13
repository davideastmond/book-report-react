import { db } from "@/db/index";
import {
  academicGrade,
  course,
  courseSession,
  roster,
  user,
} from "@/db/schema";
import { GradeSummaryData } from "@/lib/types/grading/definitions";
import { aliasedTable, and, avg, eq, gte, lte } from "drizzle-orm";

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
    const aliasedUserTable = aliasedTable(user, "aliased_user_table");
    return db
      .select({
        studentFirstName: user.firstName,
        studentLastName: user.lastName,
        studentId: roster.studentId,
        courseName: course.name,
        courseCode: course.course_code,
        coursePercentageAverage: avg(academicGrade.percentageGrade),
        isCourseCompleted: courseSession.isCompleted,
        sessionStart: courseSession.sessionStart,
        sessionEnd: courseSession.sessionEnd,
        instructorFirstName: aliasedUserTable.firstName,
        instructorLastName: aliasedUserTable.lastName,
      })
      .from(roster)
      .where(eq(roster.studentId, studentId))
      .groupBy(
        course.course_code,
        course.name,
        roster.studentId,
        user.firstName,
        user.lastName,
        aliasedUserTable.firstName,
        aliasedUserTable.lastName,
        courseSession.isCompleted,
        courseSession.sessionStart,
        courseSession.sessionEnd
      )
      .innerJoin(academicGrade, eq(roster.studentId, academicGrade.userId))
      .innerJoin(
        courseSession,
        and(
          eq(courseSession.id, academicGrade.courseSessionId),
          eq(courseSession.isCompleted, true),
          gte(courseSession.sessionStart, startDate),
          lte(courseSession.sessionEnd, endDate)
        )
      )
      .innerJoin(course, eq(course.id, courseSession.courseId))
      .fullJoin(user, eq(user.id, roster.studentId))
      .fullJoin(
        aliasedUserTable,
        eq(aliasedUserTable.id, courseSession.instructorId)
      );
  },
};
