import { db } from "@/db/index";
import {
  academicGrade,
  academicTask,
  course,
  courseSession,
  gradeWeight,
  roster,
  user,
} from "@/db/schema";
import { RawGradeReportData } from "@/lib/types/grading/definitions";
import { and, eq, gte, lte } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";

export const GradeController = {
  getRawGradeReportData: async ({
    studentId,
    startDate,
    endDate = new Date(),
  }: {
    studentId: string;
    startDate: Date;
    endDate?: Date;
  }): Promise<RawGradeReportData[]> => {
    const aliasedUser = alias(user, "alias_user_table");
    return db
      .select({
        academicTaskId: academicTask.id,
        academicTaskName: academicTask.name,
        academicTaskType: academicTask.taskType,
        courseSessionId: courseSession.id,
        studentId: roster.studentId,
        studentFirstName: user.firstName,
        studentLastName: user.lastName,
        gradeWeightId: gradeWeight.id,
        gradeWeightName: gradeWeight.name,
        gradeWeightPercentage: gradeWeight.percentage,
        percentageGrade: academicGrade.percentageGrade,
        instructorFirstName: aliasedUser.firstName,
        instructorLastName: aliasedUser.lastName,
        sessionStart: courseSession.sessionStart,
        sessionEnd: courseSession.sessionEnd,
        isCourseCompleted: courseSession.isCompleted,
        courseName: course.name,
        courseCode: course.course_code,
      })
      .from(roster)
      .where(eq(roster.studentId, studentId))
      .innerJoin(
        courseSession,
        and(
          eq(roster.courseSessionId, courseSession.id),
          eq(courseSession.isCompleted, true),
          gte(courseSession.sessionStart, startDate),
          lte(courseSession.sessionEnd, endDate)
        )
      )
      .innerJoin(course, eq(course.id, courseSession.courseId))
      .innerJoin(
        academicTask,
        eq(academicTask.courseSessionId, courseSession.id)
      )
      .innerJoin(
        academicGrade,
        eq(academicGrade.academicTaskId, academicTask.id)
      )
      .innerJoin(gradeWeight, eq(gradeWeight.id, academicTask.gradeWeightId))
      .innerJoin(user, eq(user.id, roster.studentId))
      .innerJoin(aliasedUser, eq(aliasedUser.id, courseSession.instructorId));
  },
};
