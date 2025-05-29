import {
  boolean,
  date,
  integer,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const academicGrade = pgTable("academic_grade", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id),
  academicTaskId: text("academic_task_id")
    .notNull()
    .references(() => academicTask.id),
  courseSessionId: text("course_session_id")
    .notNull()
    .references(() => courseSession.id),
  percentageGrade: integer("percentage_grade"),
  instructorFeedback: text("instructor_feedback"),
  letterGrade: text("letter_grade", {
    enum: [
      "a+",
      "a",
      "a-",
      "b+",
      "b",
      "b-",
      "c+",
      "c",
      "c-",
      "d+",
      "d",
      "d-",
      "f",
    ],
  }),
});

export const academicTask = pgTable("academic_task", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  taskType: text({ enum: ["assignment", "exam", "other"] }).default(
    "assignment"
  ),
  dueDate: date("due_date", { mode: "date" }),
  courseSessionId: text("course_session_id")
    .notNull()
    .references(() => courseSession.id),
});

export const course = pgTable("course", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  course_code: text("course_code").notNull(),
});

export const courseSession = pgTable("course_session", {
  id: text("id").primaryKey(),
  courseId: text("course_id")
    .notNull()
    .references(() => course.id),
  instructorId: text("instructor_id")
    .notNull()
    .references(() => user.id),
  sessionStart: date("session_start", { mode: "date" }).notNull(),
  sessionEnd: date("session_end", { mode: "date" }).notNull(),
  isCompleted: boolean("is_completed").default(false),
  description: text("description"),
  studentAllotment: integer("student_allotment").default(20),
});

export const roster = pgTable("roster", {
  id: text("id").primaryKey(),
  studentId: text("student_id")
    .notNull()
    .references(() => user.id),
  courseSessionId: text("course_session_id")
    .notNull()
    .references(() => courseSession.id),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
});

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull().unique(),
  role: text({ enum: ["admin", "teacher", "student"] })
    .notNull()
    .default("student"),
  hashedPassword: text("password_hash").notNull(),
  dob: date("dob", { mode: "date" }).notNull(),
});

export type AcademicGrade = typeof academicGrade.$inferSelect;
export type AcademicTask = typeof academicTask.$inferSelect;
export type Course = typeof course.$inferSelect;
export type CourseSession = typeof courseSession.$inferSelect;
export type Roster = typeof roster.$inferSelect;
export type Session = typeof session.$inferSelect;
export type User = typeof user.$inferSelect;
