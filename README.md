# Book Report

## About

This is a web app platform to manage academic grades for a school or university, allowing instructors to manage courses, course work, students and grades, and allowing students to manage their courses and grades.

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

### Grade Weighting

- Admins/Teachers can allocate weights to course work to emphasize importance of particular assignments, quizzes or final exams.

### Grading

- Admins/Teachers can assign numerical grades (0 - 100) for course work.

### Final Grade Calculation and GPA

- All course final grades are calculated using the defined weights.
- Students can search for courses that are completed within a time frame, and the system will calculate the final grade and GPA for all courses.

### Charts, Graphs and Statistics

- Admins/Teachers can view charts and graphs of course work grades.
- Admins/Teachers can view statistics of course work grades (averages, medians, etc.).

## Tech Stack

- [React](https://reactjs.org/) - A JavaScript library for building user interfaces
- [Next.js and Vercel](https://nextjs.org/) - The React Framework for producing full-stack applications with server-side rendering and static site generation
- [NextAuth.js](https://next-auth.js.org/) - Authentication for Next.js applications
- [TypeScript](https://www.typescriptlang.org/) - A superset of JavaScript that compiles to clean JavaScript output
- [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework for creating custom designs
- [Drizzle ORM](https://orm.drizzle.team/) - TypeScript ORM for Postgres databases
- [PostgreSQL](https://www.postgresql.org/) - The world's most advanced open source relational database
- [Amazon RDS](https://aws.amazon.com/rds/) - AWS Amazon Relational Database Service (Postgres)
- [Ag Charts](https://www.ag-grid.com/charts/react/quick-start/) - A powerful charting library for React applications
- [Vitest](https://vitest.dev/) - A Vite-native test framework
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) - A lightweight solution for testing React components

## Environment Variables

- `DATABASE_URL=`#the connection string for your postgres instance
- `NEXT_AUTH_SECRET=`#Required for auth - it can be any string
- `ADMIN_PASSWORD=`#Create an admin password to allow for admin tasks. It can be any string. It needs to be included in the Authorization headers as a Bearer token for admin tasks.

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

- Run the test suite

```bash
npm run test
# or
yarn test
# or
pnpm test
```

- Test Coverage

```bash
npm run test:coverage
# or
yarn test:coverage
# or
pnpm test:coverage
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
