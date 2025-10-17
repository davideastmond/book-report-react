import { SummarizedData } from "@/lib/controller/grades/calculations/definitions";

export function ClassListFinalGradeTable({
  data,
}: {
  data: SummarizedData[] | null;
}) {
  return (
    <table className="table-auto w-full mt-4" data-testid="final-grade-table">
      <thead className="text-left">
        <tr>
          <th>Student First N.</th>
          <th>Student Last N.</th>
          <th>Final Grade</th>
        </tr>
      </thead>
      <tbody>
        {data ? (
          data.map((el, index) => (
            <tr
              key={el.studentId}
              className={`${
                index % 2 === 0 ? "bg-slate-400/10" : "bg-background"
              }`}
            >
              <td>{el.studentFirstName}</td>
              <td>{el.studentLastName}</td>
              <td>{el.finalGrade.toFixed(2)}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={3}>No data available</td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
