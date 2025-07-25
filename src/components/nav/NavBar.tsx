"use client";
import { useAdmin } from "app/hooks/use-admin";
import { useAdminAuthorized } from "app/hooks/use-admin-authorized";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

const styles = {
  navMenuItem: {
    borderRight: "1.5px solid #ccc",
    padding: "0.5rem 1rem",
  },
  finalItem: {
    borderRight: "none",
    padding: "0.5rem 1rem",
  },
};
export function NavBar() {
  const { data: session } = useSession();
  const { isAdminAuthorized } = useAdminAuthorized();
  const { isStrictlyAdmin } = useAdmin();
  return (
    <div>
      <nav className="bg-gray-800 p-2 ">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/dashboard">
            <div className="rounded-full overflow-clip">
              <Image
                src="/images/app-logo/large-app-logo.png"
                width={50}
                height={50}
                alt="Logo"
              />
            </div>
          </Link>
          <div className="text-white text-lg font-bold">Book Report</div>
          <ul className="flex space-x-4">
            {!isAdminAuthorized && (
              <li style={styles.navMenuItem}>
                <Link
                  href="/dashboard/student/grades"
                  className="text-white hover:text-gray-300"
                >
                  My Grades
                </Link>
              </li>
            )}
            {isStrictlyAdmin && (
              <li style={styles.navMenuItem}>
                <Link
                  href="/dashboard/admin"
                  className="text-white hover:text-gray-300"
                >
                  Admin
                </Link>
              </li>
            )}
            <li style={styles.navMenuItem}>
              <a
                href="/dashboard/courses-sessions"
                className="text-white hover:text-gray-300"
              >
                My Courses
              </a>
            </li>
            <li style={styles.navMenuItem}>
              <a
                href="/dashboard/browse-courses"
                className="text-white hover:text-gray-300"
              >
                Browse Courses
              </a>
            </li>
            <li style={styles.navMenuItem}>
              <a href="/help" className="text-white hover:text-gray-300">
                Help❔
              </a>
            </li>
            {session?.user?.email && (
              <li style={styles.finalItem} className="flex gap-4">
                <Link href="/dashboard/user/settings">
                  {session.user.email} {displayAdminRole(session.user.role)}
                </Link>
                <button
                  className="text-white hover:text-gray-300 hover:underline hover:cursor-pointer"
                  name="logOut"
                  onClick={async () => {
                    await signOut();
                  }}
                  type="button"
                >
                  Log Out
                </button>
              </li>
            )}
          </ul>
        </div>
      </nav>
    </div>
  );
}

const displayAdminRole = (role: "student" | "teacher" | "admin") => {
  switch (role) {
    case "admin":
    case "teacher":
      return "(admin)";
    default:
      return "";
  }
};
