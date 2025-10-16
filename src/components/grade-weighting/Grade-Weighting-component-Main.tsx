"use client";

import { CourseSessionClient } from "@/clients/course-session-client";
import { weightDataValidator } from "@/lib/validators/weightings/weight-data-validator";
import { useEffect, useState } from "react";
import { z } from "zod";

import { GradeWeight } from "@/db/schema";
import { GradeWeightTable } from "./Grade-Weight-table";

type GradeWeightingComponentProps = {
  courseSessionId: string;
};

// This component allows teachers/admins to set the weighting of different grading components for a course session.
// There should be a list of course work. Then there should be a component that allows them to choose  weighting category.
// All of the category weights should add up to 100%.
export function GradeWeightingComponentMain({
  courseSessionId,
}: GradeWeightingComponentProps) {
  const [weightComponents, setWeightComponents] = useState<
    { keyTag: string }[]
  >([]);

  const [, setErrors] = useState<string | null>(null);
  const [, setIsBusy] = useState(false);
  const [currentWeights, setCurrentWeights] = useState<GradeWeight[] | null>(
    null
  );

  useEffect(() => {
    fetchCurrentWeights();
  }, [courseSessionId]);

  async function fetchCurrentWeights() {
    try {
      setIsBusy(true);
      const weights = await CourseSessionClient.getCourseWeightings(
        courseSessionId
      );
      setCurrentWeights(weights);
    } catch (error) {
      console.error("Error fetching current weights:", error);
    } finally {
      setIsBusy(false);
    }
  }

  async function handleSaveWeightings(updatedWeights: GradeWeight[]) {
    setErrors(null);

    try {
      weightDataValidator.parse(updatedWeights);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const joinedErrors = error.issues
          .map((issue) => issue.message)
          .join(". ");
        setErrors(joinedErrors);
        console.error("Error parsing weight data:", joinedErrors);
        return;
      }
      console.error(
        "Unexpected error parsing weight data:",
        (error as Error).message
      );
      return;
    }

    try {
      setIsBusy(true);
      await CourseSessionClient.createCourseWeighting(
        courseSessionId,
        updatedWeights
      );
      await fetchCurrentWeights(); // Refresh
    } catch (error) {
      console.error("Error saving weightings:", error);
      setErrors("Failed to save weightings. Please try again.");
      return;
    } finally {
      setIsBusy(false);
    }
  }

  return (
    <div>
      <h1 className="text-2xl my-4">Weight Definitions</h1>
      {currentWeights && (
        <div>
          <GradeWeightTable
            gradeWeights={currentWeights}
            onWeightsUpdated={handleSaveWeightings}
          />
        </div>
      )}
    </div>
  );
}
