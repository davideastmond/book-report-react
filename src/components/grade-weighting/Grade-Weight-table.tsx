import { GradeWeight } from "@/db/schema";
import { useMemo } from "react";

type GradeWeightTableProps = {
  gradeWeights: GradeWeight[];
};
export function GradeWeightTable({ gradeWeights = [] }: GradeWeightTableProps) {
  const getWeightSum = useMemo(() => {
    return gradeWeights.reduce((sum, weight) => sum + weight.percentage, 0);
  }, [gradeWeights]);

  return (
    <table className="w-full table-fixed">
      <thead className="text-left min-w-[200px]">
        <tr className="border bg-slate-400/10">
          <th className="px-4 py-2">Weighting Name</th>
          <th className="px-4 py-2">P. %</th>
        </tr>
      </thead>
      <tbody>
        {/* Rows will be dynamically generated here */}
        {gradeWeights.length === 0 && (
          <tr>
            <td colSpan={2} className="text-center p-4 font-thin">
              No grade weights are currently defined.
            </td>
          </tr>
        )}
        {gradeWeights.map((weight) => (
          <tr key={weight.id} className="hover:bg-list-hover/20">
            <td className="px-4 py-2">{weight.name}</td>
            <td className="px-4 py-2">{weight.percentage}%</td>
          </tr>
        ))}
        {gradeWeights.length > 0 && (
          <tr>
            <td></td>
            <td className="border-t border-stone-200 text-blue-400">
              {getWeightSum} %
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
