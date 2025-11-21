"use client";

import {
  Navbar,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from "@heroui/react";
import { useAdminAuthorized } from "app/hooks/use-admin-authorized";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { CourseSessionsStudentNavToolbar } from "../../student/Course-sessions-nav-toolbar";

const MenuToggleButton = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M5 8H13.75M5 12H19M10.25 16L19 16"
        stroke="#ffffff"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
export const CourseSessionsNavToolbar = () => {
  const { courseSessionId } = useParams<{
    courseSessionId: string;
  }>();

  const searchParams = useSearchParams();
  const idFromSearchParams = searchParams.get("id");

  const { isAdminAuthorized } = useAdminAuthorized();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const computedCourseSessionId = useMemo(() => {
    if (courseSessionId) return courseSessionId;
    if (idFromSearchParams === "null" || idFromSearchParams === "undefined")
      return null;

    if (idFromSearchParams) return idFromSearchParams;
    return null;
  }, [courseSessionId, idFromSearchParams]);

  const menuItems = useMemo(() => {
    return [
      {
        label: "Exams and Course Work",
        href: `/dashboard/courses-sessions/${computedCourseSessionId}/admin/course-work`,
      },
      {
        label: "Grading",
        href: `/dashboard/courses-sessions/${computedCourseSessionId}/admin/grading`,
      },
      {
        label: "Grade Weightings",
        href: `/dashboard/courses-sessions/${computedCourseSessionId}/admin/grading/weighting`,
      },
      {
        label: "Settings",
        href: `/dashboard/courses-sessions/${computedCourseSessionId}/admin/settings`,
      },
      {
        label: "Final Grade Report",
        href: `/dashboard/courses-sessions/${computedCourseSessionId}/admin/final-grade-report`,
      },
      {
        label: "Main",
        href: `/dashboard/courses-sessions/view?id=${computedCourseSessionId}`,
      },
    ];
  }, [computedCourseSessionId]);

  if (!isAdminAuthorized) {
    return <CourseSessionsStudentNavToolbar />;
  }

  if (!computedCourseSessionId) return null;

  return (
    <Navbar className="bg-green-900 p-1" onMenuOpenChange={setIsMenuOpen}>
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
          icon={MenuToggleButton}
        />
      </NavbarContent>
      <NavbarContent className="hidden sm:flex gap-4 w-full justify-around">
        {menuItems.map((el) => (
          <NavbarItem key={el.href}>
            <Link href={el.href} className="text-white hover:text-gray-300">
              {el.label}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>

      <NavbarMenu className="bg-green-950 absolute top-24 w-full">
        {menuItems.map((el) => (
          <NavbarMenuItem key={el.href}>
            <Link href={el.href} className="text-white hover:text-gray-700">
              {el.label}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
};
