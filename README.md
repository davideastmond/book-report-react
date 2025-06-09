# Book Report

## About

This is a web app platform to manage academics for a school or university, allowing instructors to manages courses, students and grades, and allowing students to manage their courses and grades.

## Features

### Authentication

- Sign up and log in with email and password.
- Student and Admin/Teacher security access

### User Management

- User can update their password.
- User can update their name.

### Courses and Course Work

- Admins/Teachers can create courses.
- Admins/Teachers can create/update course work (assignments, quizzes, exams, essays...) for courses.
- Admins/Teachers can enroll students in courses.
- Students can enroll and de-enroll themselves in/from courses.
- Admins/Teachers can lock a course, preventing students from enrolling or de-enrolling.
- Admins/Teachers can set a course as completed.

### Grading

- Admins/Teachers can assign numerical and letter grades to students for course work.
- Students can view their grades for courses that are completed.

## Tech Stack

- [React](https://reactjs.org/) - A JavaScript library for building user interfaces
- [Next.js and Vercel](https://nextjs.org/) - The React Framework for Production
- [TypeScript](https://www.typescriptlang.org/) - A superset of JavaScript that compiles to clean JavaScript output
- [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework for creating custom designs
- [Drizzle ORM](https://orm.drizzle.team/) - TypeScript ORM for Postgres databases
- [PostgreSQL](https://www.postgresql.org/) - The world's most advanced open source relational database
- [Amazon RDS](https://aws.amazon.com/rds/) - Amazon Relational Database Service (Postgres)

## Environment Variables

DATABASE_URL=#the connection string for your postgres instance
NEXT_AUTH_SECRET=#Required for auth - it can be any string
ADMIN_PASSWORD=#Create an admin password to allow for admin tasks. It can be any string. It needs to be included in the Authorization headers as a Bearer token for admin tasks.

## Getting Started

- Clone the repository.
- Create a `.env.local` file in the root directory of the project and add the following environment variables, using `sample.env` as a reference:
- install the dependencies by running:

```bash
npm install
# or
yarn install
# or
pnpm install
```

- Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
