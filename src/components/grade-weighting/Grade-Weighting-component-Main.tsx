"use client";

import { CourseSessionClient } from "@/clients/course-session-client";
import { weightDataValidator } from "@/lib/validators/weightings/weight-data-validator";
import { useEffect, useState } from "react";
import { z } from "zod";

import { GradeWeight } from "@/db/schema";
import { useAdmin } from "app/hooks/use-admin";
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

  const [errors, setErrors] = useState<string | null>(null);
  const [isBusy, setIsBusy] = useState(false);
  const [currentWeights, setCurrentWeights] = useState<GradeWeight[] | null>(
    null
  );

  const handleRemoveWeighting = (name: string) => {
    const tempWeightComponents = weightComponents.filter(
      (component) => component.keyTag !== name
    );
    setWeightComponents(tempWeightComponents);
  };

  useEffect(() => {
    fetchCurrentWeights();
  }, [courseSessionId]);

  const { isAdminEditable } = useAdmin(courseSessionId);

  function handleAddWeighting() {
    // The id and name will be unique for each component.

    const newWeightComponent = {
      keyTag: `weight_${weightComponents.length + crypto.randomUUID()}`,
    };
    setWeightComponents([...weightComponents, newWeightComponent]);
  }

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
    /*
    const weightData = weightComponents.map((component) => {
      const percentageInput = document.querySelector(
        `input[name="num_${component.keyTag}"]`
      ) as HTMLInputElement;

      const weightCaptionInputElement = document.querySelector(
        `input[name="${component.keyTag}"]`
      ) as HTMLInputElement;

      return {
        keyTag: component.keyTag.split("_")[1] || component.keyTag,
        name: weightCaptionInputElement.value,
        percentage: parseInt(percentageInput.value) || 0,
      };
    });
    */

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
