import Link from "next/link";
import { ClassesSessionsList } from "./classes-sessions-list/Classes-sessions-list";

type ClassesSessionsMainProps = {
  isAdmin?: boolean;
};
export function ClassesSessionsMain({ isAdmin }: ClassesSessionsMainProps) {
  return (
    <>
      {isAdmin && (
        <div className="flex justify-end p-4">
          <Link href="/dashboard/classes-sessions/new" className="flatStyle">
            + New Class Session
          </Link>
        </div>
      )}
      <ClassesSessionsList />
    </>
  );
}
