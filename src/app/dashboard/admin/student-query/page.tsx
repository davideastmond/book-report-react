"use client";
import { UserQueryPage } from "@/components/user-query-page/User-query-page";
import { useAdminAuthorized } from "app/hooks/use-admin-authorized";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function StudentQueryPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { isAdminAuthorized } = useAdminAuthorized();

  if (status === "unauthenticated") {
    router.replace("/login");
  }

  if (!isAdminAuthorized) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-lg">You do not have permission to view this page.</p>
      </div>
    );
  }
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Student Query</h1>
      <UserQueryPage />
    </div>
  );
}
