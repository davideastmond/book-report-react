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
import { CourseGradingStats } from "@/lib/types/grading/stats/definition";
import { RawGradeReportData } from "@/lib/types/grading/student/definitions";
import { and, eq, gte, lte } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";

export const GradeController = {
  getRawDataForCourseSessionById: async (
    courseSessionId: string
  ): Promise<CourseGradingStats[]> => {
    const data: CourseGradingStats[] = await db
      .select({
        academicTaskId: academicTask.id,
        academicTaskName: academicTask.name,
        academicTaskType: academicTask.taskType,
        courseSessionId: courseSession.id,
        gradeWeightId: gradeWeight.id,
        gradeWeightName: gradeWeight.name,
        gradeWeightPercentage: gradeWeight.percentage,
        percentageGrade: academicGrade.percentageGrade,
        sessionStart: courseSession.sessionStart,
        sessionEnd: courseSession.sessionEnd,
        isCourseCompleted: courseSession.isCompleted,
        courseName: course.name,
        courseCode: course.course_code,
        studentId: roster.studentId,
        studentFirstName: user.firstName,
        studentLastName: user.lastName,
        studentGender: user.gender,
        studentDob: user.dob,
      })
      .from(roster)
      .where(eq(roster.courseSessionId, courseSessionId))
      .innerJoin(user, eq(user.id, roster.studentId))
      .innerJoin(
        courseSession,
        and(
          eq(courseSession.id, courseSessionId),
          eq(courseSession.isCompleted, true)
        )
      )
      .innerJoin(
        academicGrade,
        and(
          eq(academicGrade.userId, user.id),
          eq(academicGrade.courseSessionId, courseSessionId)
        )
      )
      .innerJoin(
        academicTask,
        and(
          eq(academicTask.id, academicGrade.academicTaskId),
          eq(academicTask.courseSessionId, courseSessionId)
        )
      )
      .innerJoin(
        gradeWeight,
        and(
          eq(gradeWeight.courseSessionId, courseSessionId),
          eq(gradeWeight.id, academicTask.gradeWeightId)
        )
      )
      .innerJoin(course, eq(course.id, courseSession.courseId));

    return data;
  },
  getRawGradeReport: async ({
    studentId,
  }: {
    studentId: string;
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
      .innerJoin(courseSession, eq(courseSession.id, roster.courseSessionId))
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
  getRawGradeReportDataByDateRange: async ({
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
