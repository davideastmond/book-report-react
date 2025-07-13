"use client";

import { CourseSessionClient } from "@/clients/course-session-client";
import { AggregatedCourseAssignmentData } from "@/lib/controller/grades/aggregators/definitions";
import { AgChartOptions } from "ag-charts-community";
import { AgCharts } from "ag-charts-react";
import { useEffect, useMemo, useState } from "react";

// This component is responsible for rendering a bar chart for each student and the assignment grades
export function AssignmentsOverview({
  courseSessionId,
}: {
  courseSessionId: string;
}) {
  const [aggregatedData, setAggregatedData] = useState<
    AggregatedCourseAssignmentData[]
  >([]);

  useEffect(() => {
    fetchAssignments();
  }, []);

  async function fetchAssignments() {
    const data = await CourseSessionClient.getAssignmentsOverview(
      courseSessionId
    );
    setAggregatedData(data);
  }

  const assignmentSeries = useMemo(() => {
    if (aggregatedData.length === 0) {
      return [];
    }
    const series = [];
    for (let i = 0; i < aggregatedData[0].assignments.length; i++) {
      series.push({
        type: "bar",
        xKey: "studentName",
        yKey: `a_${i + 1}`,
        yName: aggregatedData[0].assignments[i].academicTaskName,
        direction: "horizontal",
      });
    }
    return series;
  }, [aggregatedData]);

  const chartData = useMemo<AgChartOptions>(() => {
    if (aggregatedData.length === 0) {
      return {
        data: [],
        series: [],
      };
    }

    const data = aggregatedData.map((item) => {
      const element: Record<string, string | string[] | number | null> = {
        studentName: item.studentFirstName + " " + item.studentLastName,
        assignments: item.assignments.map(
          (a) => a.academicTaskName
        ) as string[],
      };

      item.assignments.forEach((a, index) => {
        element[`a_${index + 1}`] = a.grade;
      });
      return element;
    });

    return {
      theme: "ag-material-dark",
      data: data,
      series: assignmentSeries,
    } as AgChartOptions;
  }, [aggregatedData]);

  return (
    <div>
      <AgCharts options={chartData} />
    </div>
  );
}
