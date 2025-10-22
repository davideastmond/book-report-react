"use client";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from "@heroui/react";
import { useAdmin } from "app/hooks/use-admin";
import { useAdminAuthorized } from "app/hooks/use-admin-authorized";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

const HamburgerIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="3" y="6" width="18" height="2" fill="white" />
    <rect x="3" y="11" width="18" height="2" fill="white" />
    <rect x="3" y="16" width="18" height="2" fill="white" />
  </svg>
);

const LogOutButton = () => (
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
);

export function NavBar() {
  const { data: session } = useSession();
  const { isAdminAuthorized } = useAdminAuthorized();
  const { isStrictlyAdmin } = useAdmin();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = useMemo(() => {
    const items = [
      { label: "My Grades", href: "/dashboard/student/grades" },
      { label: "Admin", href: "/dashboard/admin" },
      { label: "My Courses", href: "/dashboard/courses-sessions" },
      { label: "Browse Courses", href: "/dashboard/browse-courses" },
      {
        label: `${session?.user?.email} ${displayAdminRole(
          session?.user?.role || "student"
        )}`,
        href: "/dashboard/user/settings",
      },
      { label: "Help❔", href: "/help" },
    ];

    const filteredItems = items.reduce((acc, item) => {
      if (item.label === "My Grades" && isAdminAuthorized) {
        return acc;
      }
      if (item.label === "Admin" && !isStrictlyAdmin) {
        return acc;
      }
      acc.push(item);
      return acc;
    }, [] as typeof items);

    return filteredItems;
  }, [session, isAdminAuthorized, isStrictlyAdmin]);

  return (
    <Navbar className="bg-gray-800 p-2" onMenuOpenChange={setIsMenuOpen}>
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
          icon={HamburgerIcon}
        />

        <NavbarBrand className="flex gap-1 items-center">
          <Link href="/dashboard">
            <div className="rounded-full overflow-clip">
              <Image
                src="/images/app-logo/large-app-logo.png"
                width={50}
                height={50}
                alt="Book Report Logo"
              />
            </div>
          </Link>
          <p className="text-white text-lg font-bold">Book Report</p>
        </NavbarBrand>
      </NavbarContent>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        {menuItems.map((el) => (
          <NavbarItem key={el.href}>
            <Link
              href={el.href}
              className="text-white hover:text-gray-300 sm:text-sm"
            >
              {el.label}
            </Link>
          </NavbarItem>
        ))}
        <NavbarItem>
          <LogOutButton />
        </NavbarItem>
      </NavbarContent>
      <NavbarMenu className="bg-gray-900 absolute top-16 w-full">
        {menuItems.map((el) => (
          <NavbarMenuItem key={el.href}>
            <Link href={el.href} className="text-white hover:text-gray-700">
              {el.label}
            </Link>
          </NavbarMenuItem>
        ))}
        <LogOutButton />
      </NavbarMenu>
    </Navbar>
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
