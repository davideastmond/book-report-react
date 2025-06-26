"use client";

import { GradesClient } from "@/clients/grades-client";
import { GradeSummaryData } from "@/lib/types/grading/definitions";
import { debounce } from "lodash";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { CourseGradeSummaryTable } from "../grading-table/student/course/Course-grade-summary-table";
export function GradesOverviewComponent() {
  const dateStamp = useMemo(() => new Date(), []);

  const { data: session, status } = useSession();
  const router = useRouter();

  const [gradesOverviewData, setGradesOverviewData] = useState<
    GradeSummaryData[]
  >([]);
  const [gpaValue, setGpaValue] = useState<number | string | null>(null);

  useEffect(() => {
    fetchGrades();
  }, [session?.user?.id]);

  if (status === "unauthenticated") {
    router.replace("/login");
  }

  async function fetchGrades() {
    if (!session?.user) return;

    const startDateInput = document.getElementById(
      "sessionStart"
    ) as HTMLInputElement;
    const startDate = new Date(startDateInput.value);

    const endDateInput = document.getElementById(
      "sessionEnd"
    ) as HTMLInputElement;
    const endDate = endDateInput.value
      ? new Date(endDateInput.value)
      : new Date();

    const overViewData = await GradesClient.getGradesForStudentWithDateRange({
      studentId: session.user.id,
      startDate,
      endDate,
    });
    setGradesOverviewData(overViewData.data);
    setGpaValue(overViewData.gpa);
  }

  async function handleDateRangeChange() {
    await fetchGrades();
    console.info("Fetching grades...data");
  }

  const debouncedFetchGrades = debounce(handleDateRangeChange, 500);
  return (
    <div>
      <h1 className="text-3xl">Grades Overview</h1>
      <div>
        <h2>Filter Dates</h2>
        <form>
          <div className="flex gap-10">
            <div className="max-w-[300px]">
              <input
                type="date"
                id="sessionStart"
                name="sessionStart"
                className="w-full p-2"
                autoComplete="off"
                data-lpignore="true"
                onKeyDown={() => false}
                required
                onChange={debouncedFetchGrades}
                defaultValue={new Date().toISOString().split("T")[0]}
              ></input>
            </div>
            <div className="max-w-[300px]">
              <input
                type="date"
                id="sessionEnd"
                name="sessionEnd"
                className="w-full p-2"
                autoComplete="off"
                data-lpignore="true"
                onKeyDown={() => false}
                onChange={debouncedFetchGrades}
                required
                defaultValue={
                  new Date(dateStamp.getFullYear(), dateStamp.getMonth() + 6, 1)
                    .toISOString()
                    .split("T")[0]
                }
              ></input>
            </div>
          </div>
          <div>
            <button type="submit"></button>
          </div>
        </form>
      </div>
      <div>
        {gradesOverviewData.map((gradeSummary) => (
          <div className="my-4" key={gradeSummary.courseCode}>
            <CourseGradeSummaryTable gradeSummaryData={gradeSummary} />
          </div>
        ))}
      </div>
      {gpaValue && (
        <div className="flex justify-end px-4">
          <table>
            <thead>
              <tr className="border bg-slate-400/10 block px-4">
                <th>Cumulative GPA</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="text-blue-400 flex justify-end pr-1">
                  {gpaValue}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
