"use client";

import { GradesClient } from "@/clients/grades-client";
import { GradeSummaryData } from "@/lib/types/grading/student/definitions";
import { Card, CardBody } from "@heroui/react";
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
  }, []);

  if (status === "unauthenticated") {
    router.replace("/login");
  }

  async function fetchGrades() {
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

    try {
      const overViewData = await GradesClient.getGradesForStudentWithDateRange({
        studentId: session?.user?.id as string,
        startDate,
        endDate,
      });

      setGradesOverviewData(overViewData.data);
      setGpaValue(overViewData.gpa);
    } catch (error) {
      console.error("Error fetching grades:", error);
    }
  }

  async function handleDateRangeChange() {
    await fetchGrades();
  }

  const debouncedFetchGrades = debounce(handleDateRangeChange, 500);
  return (
    <div>
      <h1 className="text-3xl">Grades Overview</h1>
      <div className="mt-4">
        <h2 className="ml-[20%]">Filter Dates</h2>
        <form>
          <div className="flex gap-10">
            <div className="max-w-[300px]">
              <label htmlFor="sessionStart">Session Start</label>
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
              <label htmlFor="sessionEnd">Session End</label>
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
        {gradesOverviewData.length === 0 && (
          <p className="mt-4 text-yellow-400">
            No course grades available for the selected dates.
          </p>
        )}
        {gradesOverviewData.map((gradeSummary) => (
          <div className="my-4" key={gradeSummary.courseCode}>
            <CourseGradeSummaryTable gradeSummaryData={gradeSummary} />
          </div>
        ))}
      </div>
      {gpaValue && (
        <Card>
          <CardBody>
            <p className="font-bold flex justify-end">
              Cumulative GPA:
              <span className="text-blue-500 ml-2">{gpaValue}</span>
            </p>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
