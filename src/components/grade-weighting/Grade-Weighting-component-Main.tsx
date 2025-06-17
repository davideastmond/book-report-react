"use client";

import { CourseSessionClient } from "@/clients/course-session-client";
import { weightDataValidator } from "@/lib/validators/weightings/weight-data-validator";
import { useEffect, useState } from "react";
import { z } from "zod";

import { GradeWeight } from "@/db/schema";
import { useAdmin } from "app/hooks/use-admin";
import { GradeWeight as GradeWeightComponent } from "./Grade-Weight";
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
  const [weightSums, setWeightSums] = useState<number>(0);
  const [errors, setErrors] = useState<string | null>(null);
  const [isBusy, setIsBusy] = useState(false);
  const [currentWeights, setCurrentWeights] = useState<GradeWeight[]>([]);

  const handleRemoveWeighting = (name: string) => {
    const tempWeightComponents = weightComponents.filter(
      (component) => component.keyTag !== name
    );
    setWeightComponents(tempWeightComponents);
  };

  useEffect(() => {
    setWeightSums(getWeightSum());
  }, [weightComponents]);

  useEffect(() => {
    fetchCurrentWeights();
  }, []);

  const { isAdminEditable } = useAdmin(courseSessionId);

  function handleAddWeighting() {
    // The id and name will be unique for each component.

    const newWeightComponent = {
      keyTag: `weight_${weightComponents.length + crypto.randomUUID()}`,
    };
    setWeightComponents([...weightComponents, newWeightComponent]);
  }

  const getWeightSum = () => {
    return weightComponents.reduce((acc, component) => {
      const percentageInput = document.querySelector(
        `input[name="num_${component.keyTag}"]`
      ) as HTMLInputElement;

      const percentage = parseInt(percentageInput.value) || 0;
      return acc + percentage;
    }, 0);
  };

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

  async function handleSaveWeightings() {
    setErrors(null);

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

    try {
      weightDataValidator.parse(weightData);
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
        weightData
      );
      await fetchCurrentWeights(); // Refresh
    } catch (error) {
      console.error("Error saving weightings:", error);
      setErrors("Failed to save weightings. Please try again.");
      return;
    } finally {
      setIsBusy(false);
    }
    // Get the form data for each weight component
  }

  return (
    <div>
      <h1 className="text-2xl my-4">Weight Definitions</h1>
      <div>
        <GradeWeightTable gradeWeights={currentWeights} />
      </div>
      <h2 className="text-2xl mt-6">Add Weightings</h2>
      <div className="flex px-4 mt-6">
        <button
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:cursor-pointer hover:bg-blue-600/40 responsiveStyle "
          onClick={handleAddWeighting}
          disabled={!isAdminEditable}
        >
          + Add
        </button>
      </div>
      <form onSubmit={(e) => e.preventDefault()}>
        {weightComponents.map((component) => (
          <GradeWeightComponent
            key={component.keyTag}
            name={component.keyTag}
            onRemove={handleRemoveWeighting}
          />
        ))}
        <div>
          <p className="mt-4 text-sm text-blue-500">
            Total Weight: {weightSums}%
          </p>
        </div>
        <div>
          <button
            type="submit"
            className="mt-4 responsiveStyle bg-green-500 text-white px-4 py-2 rounded hover:cursor-pointer hover:enabled:bg-green-600/40 disabled:opacity-50"
            disabled={
              isAdminEditable || weightComponents.length === 0 || isBusy
            }
            onClick={handleSaveWeightings}
          >
            Save Weightings
          </button>
        </div>
      </form>
      <div className="mt-4">
        <p className="text-sm text-gray-300">
          Note: All weights should add up to 100%. If you have not set any
          weights, the default will be 100% for the first component.
        </p>
        {currentWeights.length > 0 && (
          <p className="text-sm text-gray-300">
            Current weights will be overwritten when you save new weights.
          </p>
        )}
      </div>
      {errors && (
        <div className="mt-4 text-red-500">
          <p>{errors}</p>
        </div>
      )}
    </div>
  );
}
