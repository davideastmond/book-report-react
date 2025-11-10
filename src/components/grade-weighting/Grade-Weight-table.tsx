"use client";
import { CourseSessionClient } from "@/clients/course-session-client";
import { GradeWeight } from "@/db/schema";
import { useToast } from "@/hooks/use-toast";
import { weightDataValidator } from "@/lib/validators/weightings/weight-data-validator";
import { Spinner } from "@heroui/react";
import { useEffect, useState } from "react";
import { z } from "zod";

// This component allows teachers/admins to set the weighting of different grading components for a course session.
// There should be a list of course work. Then there should be a component that allows them to choose  weighting category.
// All of the category weights should add up to 100%.

export function GradeWeightTable({
  courseSessionId,
}: {
  courseSessionId: string;
}) {
  const [calculatedWeights, setCalculatedWeights] = useState<GradeWeight[]>([]);

  const [validationError, setValidationError] = useState<string | null>(null);
  const [errors, setErrors] = useState<string | null>(null);
  const [isBusy, setIsBusy] = useState(false);
  const { showToast, ToastElement: WeightsUpdatedToast } = useToast();
  useEffect(() => {
    fetchCurrentWeights();
  }, [courseSessionId]);
  const fetchCurrentWeights = async () => {
    try {
      setIsBusy(true);
      const weights = await CourseSessionClient.getCourseWeightings(
        courseSessionId
      );
      // TODO: setCurrentWeights(weights);
      setCalculatedWeights(weights);
    } catch (error) {
      console.error("Error fetching current weights:", error);
    } finally {
      setIsBusy(false);
    }
  };

  const handleSaveWeightings = async (updatedWeights: GradeWeight[]) => {
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
      showToast("Weightings updated successfully.");
      await fetchCurrentWeights(); // Refresh
    } catch (error) {
      console.error("Error saving weightings:", error);
      setErrors("Failed to save weightings. Please try again.");
      return;
    } finally {
      setIsBusy(false);
    }
  };
  const handleWeightsUpdated = async () => {
    const inputs = document.querySelectorAll('input[type="number"]');
    const updatedWeights: { id: string; name: string; percentage: number }[] =
      [];
    inputs.forEach((input) => {
      const { id } = input;
      const name = (
        document.querySelector(`input[name="name_${id}"]`) as HTMLInputElement
      ).value;
      const percentage = parseInt((input as HTMLInputElement).value) || 0;
      updatedWeights.push({ id, name, percentage });
    });

    // For validation purposes, ensure total percentage is 100
    const totalPercentage = updatedWeights.reduce(
      (sum, weight) => sum + weight.percentage,
      0
    );
    if (totalPercentage !== 100) {
      setValidationError("Total percentage must equal 100%");
      return;
    }
    setValidationError(null);
    // onWeightsUpdated?.(updatedWeights as GradeWeight[]);
    await handleSaveWeightings(updatedWeights as GradeWeight[]);
  };

  const handleDelete = (id: string) => {
    const updatedWeights = calculatedWeights.filter(
      (weight) => weight.id !== id
    );
    setCalculatedWeights(updatedWeights);
  };

  const addBlankSegment = () => {
    const newId = `new_${crypto.randomUUID()}`;
    const newWeight: GradeWeight = {
      id: newId,
      keyTag: "",
      courseSessionId: "",
      name: "",
      percentage: 0,
    };
    setCalculatedWeights([...calculatedWeights, newWeight]);
  };

  if (isBusy) return <Spinner />;
  return (
    <>
      <div className="flex justify-end mr-2">
        <button onClick={addBlankSegment}>Add +</button>
      </div>
      <table className="w-full">
        <thead className="text-left min-w-[200px]">
          <tr className="border bg-slate-400/10">
            <th></th>
            <th className="px-4 py-2">Weighting Name</th>
            <th className="px-4 py-2">P. %</th>
          </tr>
        </thead>
        <tbody>
          {/* Rows will be dynamically generated here */}
          {calculatedWeights.length === 0 && (
            <tr>
              <td colSpan={2} className="text-center p-4 font-thin">
                No grade weights are currently defined.
              </td>
            </tr>
          )}
          {calculatedWeights.map((weight) => (
            <tr key={weight.id} className="hover:bg-list-hover/20">
              <td>
                <button
                  className="text-red-500 hover:cursor-pointer"
                  onClick={() => handleDelete(weight.id)}
                >
                  ❌
                </button>
              </td>
              <td className="px-4 py-2">
                <input
                  type="text"
                  id={`name_${weight.id}`}
                  name={`name_${weight.id}`}
                  className="border border-gray-300 rounded p-2 w-full"
                  defaultValue={weight.name}
                  maxLength={100}
                />
              </td>
              <td className="px-4 py-2">
                <input
                  id={weight.id}
                  name={`num_${weight.id}`}
                  type="number"
                  min={0}
                  max={100}
                  defaultValue={weight.percentage}
                  className="w-full border border-gray-300 rounded-md p-1"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {validationError && (
        <div className="text-red-500 mt-2 ml-4">{validationError}</div>
      )}
      {errors && (
        <div className="mt-4 p-4 border border-red-500 bg-red-100 text-red-700">
          {errors}
        </div>
      )}
      <div className="flex justify-end mr-4">
        <button
          type="button"
          className="mt-4 responsiveStyle bg-green-500 text-white px-4 py-2 rounded hover:cursor-pointer hover:enabled:bg-green-600/40 disabled:opacity-50"
          onClick={handleWeightsUpdated}
        >
          Update Weightings
        </button>
      </div>
      <div>
        <WeightsUpdatedToast />
      </div>
    </>
  );
}
