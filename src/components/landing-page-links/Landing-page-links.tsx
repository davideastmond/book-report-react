"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// This component should render the login and new account links if there is no session.user
// otherwise we can immediately redirect the user?
export function LandingPageLinks() {
  const router = useRouter();
  const { status } = useSession();

  if (status === "authenticated") {
    router.push("/dashboard");
    return null;
  }

  return (
    <div className="flex flex-col justify-center gap-4 mt-10">
      <Link href="/login" className="self-center">
        Log in
      </Link>
      <Link href="/register" className="self-center">
        New Account
      </Link>
    </div>
  );
}
