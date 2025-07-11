export const AdminStatsNav = ({
  courseSessionId,
}: {
  courseSessionId: string;
}) => {
  return (
    <div className="bg-green-900 p-1 text-sm">
      <ul className="flex justify-start gap-12">
        <li>
          <a
            href={`/dashboard/admin/completed-courses-summary`}
            className="text-white hover:text-gray-300"
          >
            Back to Summary
          </a>
        </li>
        <li>
          <a
            href={`/dashboard/admin/${courseSessionId}/stats/assignments`}
            className="text-white hover:text-gray-300"
          >
            Assignments Stats
          </a>
        </li>
      </ul>
    </div>
  );
};
