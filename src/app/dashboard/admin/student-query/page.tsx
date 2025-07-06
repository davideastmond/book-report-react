"use client";
import { UserQueryPage } from "@/components/user-query-page/User-query-page";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function StudentQueryPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  if (status === "unauthenticated") {
    router.replace("/login");
  }

  useEffect(() => {
    if (session?.user && session.user.role !== "admin") {
      router.replace("/dashboard");
    }
  }, [session?.user]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Student Query</h1>
      <UserQueryPage />
    </div>
  );
}
