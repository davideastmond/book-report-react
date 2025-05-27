"use client";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";

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
  return (
    <div>
      <nav className="bg-gray-800 p-2 ">
        <div className="container mx-auto flex justify-between items-center">
          <Image
            src="/images/app-logo/large-app-logo.png"
            width={50}
            height={50}
            alt="Logo"
          />
          <div className="text-white text-lg font-bold">Book Report</div>
          <ul className="flex space-x-4">
            <li style={styles.navMenuItem}>
              <a
                href="/dashboard/courses-sessions"
                className="text-white hover:text-gray-300"
              >
                Courses
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
              <button
                className="text-white hover:text-gray-300"
                onClick={async () => await signOut()}
              >
                Log Out
              </button>
            </li>
            <li style={styles.navMenuItem}>
              <a href="/help" className="text-white hover:text-gray-300">
                Help❔
              </a>
            </li>
            {session?.user?.email && (
              <li style={styles.finalItem}>
                {session.user.email} {displayAdminRole(session.user.role)}
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
