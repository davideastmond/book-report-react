"use client";
import { GradeWeight } from "@/db/schema";
import { useState } from "react";

type GradeWeightTableProps = {
  gradeWeights: GradeWeight[];
  onWeightsUpdated?: (weights: GradeWeight[]) => void;
};
export function GradeWeightTable({
  onWeightsUpdated,
  gradeWeights = [],
}: GradeWeightTableProps) {
  const [calculatedWeights, setCalculatedWeights] =
    useState<GradeWeight[]>(gradeWeights);

  const [validationError, setValidationError] = useState<string | null>(null);

  const handleWeightsUpdated = () => {
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
    onWeightsUpdated?.(updatedWeights as GradeWeight[]);
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
                />
              </td>
              <td className="px-4 py-2">
                <input
                  id={weight.id}
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
      <div className="flex justify-end mr-4">
        <button
          type="button"
          className="mt-4 responsiveStyle bg-green-500 text-white px-4 py-2 rounded hover:cursor-pointer hover:enabled:bg-green-600/40 disabled:opacity-50"
          onClick={handleWeightsUpdated}
        >
          Update Weightings
        </button>
      </div>
    </>
  );
}
