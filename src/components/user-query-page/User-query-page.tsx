"use client";
import { UserSearch } from "../user-search/User-Search";

export function UserQueryPage() {
  const handleUserSelected = (userId: string) => {
    // Handle user selection
    console.info("Selected User ID:", userId);
  };
  return (
    <div className="flex flex-col h-full">
      <div>
        <UserSearch onUserSelect={handleUserSelected} />
      </div>
      {/* We want to show details after a student is selected */}
    </div>
  );
}
