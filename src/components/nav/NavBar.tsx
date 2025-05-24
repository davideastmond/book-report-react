"use client";
import { signOut } from "next-auth/react";
import Image from "next/image";
export function NavBar() {
  return (
    <div>
      <nav className="bg-gray-800 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Image
            src="/images/app-logo/large-app-logo.png"
            width={50}
            height={50}
            alt="Logo"
          />
          <div className="text-white text-lg font-bold">Book Report</div>
          <ul className="flex space-x-4">
            <li>
              <a
                href="/dashboard/classes-sessions"
                className="text-white hover:text-gray-300"
              >
                Classes
              </a>
            </li>
            <li>
              <button
                className="text-white hover:text-gray-300"
                onClick={async () => await signOut()}
              >
                Log Out
              </button>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
}
