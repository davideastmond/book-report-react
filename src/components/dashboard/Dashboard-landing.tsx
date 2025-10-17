"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Spinner } from "../spinner/Spinner";

export function DashboardLanding() {
  const { status } = useSession();
  const router = useRouter();
  if (status === "loading") return <Spinner />;
  if (status === "unauthenticated") {
    router.replace("/login");
    return null; // Prevent rendering while redirecting
  }
  return (
    <div className="lg:ml-[20%] lg:mr-[20%] lg:mt-[20vh]">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p>Welcome to the dashboard!</p>
    </div>
  );
}
