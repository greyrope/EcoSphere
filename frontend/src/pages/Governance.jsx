const mockAudits = [
  {
    id: 1,
    title: 'Annual Supplier Code of Conduct',
    deadline: 'Oct 15, 2026',
    severity: 'High',
    status: 'Pending',
  },
  {
    id: 2,
    title: 'Q3 Data Privacy Review',
    deadline: 'Sep 30, 2026',
    severity: 'Medium',
    status: 'In Progress',
  },
  {
    id: 3,
    title: 'Board Diversity Report',
    deadline: 'Aug 01, 2026',
    severity: 'Low',
    status: 'Completed',
  },
];

export default function Governance() {
  return (
    <div className="mx-auto max-w-7xl space-y-8 p-8">
      <header className="flex items-center justify-between border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Governance & Compliance
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Track audits, corporate policies, and ethical compliance.
          </p>
        </div>
        <button className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-amber-600">
          Generate Audit Report
        </button>
      </header>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="rounded-xl border border-t-4 border-slate-200 border-t-amber-500 bg-white p-6 shadow-sm">
          <h3 className="text-sm font-medium text-slate-500">
            Open Audit Findings
          </h3>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900">3</span>
            <span className="text-sm font-medium text-slate-500">Pending</span>
          </div>
        </div>
        <div className="rounded-xl border border-t-4 border-slate-200 border-t-amber-400 bg-white p-6 shadow-sm">
          <h3 className="text-sm font-medium text-slate-500">
            Compliance Rate
          </h3>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900">98.5</span>
            <span className="text-sm font-medium text-slate-500">%</span>
          </div>
        </div>
        <div className="rounded-xl border border-t-4 border-slate-200 border-t-amber-300 bg-white p-6 shadow-sm">
          <h3 className="text-sm font-medium text-slate-500">
            Policies Reviewed
          </h3>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900">24</span>
            <span className="text-sm font-medium text-slate-500">/ 24</span>
          </div>
        </div>
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">
          Compliance Task Tracker
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3 font-medium">Audit / Task</th>
                <th className="px-4 py-3 font-medium">Risk Level</th>
                <th className="px-4 py-3 font-medium">Deadline</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 text-right font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mockAudits.map((audit) => (
                <tr key={audit.id} className="hover:bg-slate-50">
                  <td className="px-4 py-4 font-medium text-slate-900">
                    {audit.title}
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`rounded-md px-2 py-1 text-xs font-bold tracking-wider uppercase ${
                        audit.severity === 'High'
                          ? 'bg-rose-100 text-rose-700'
                          : audit.severity === 'Medium'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {audit.severity}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-slate-600">{audit.deadline}</td>
                  <td className="px-4 py-4 text-slate-600">{audit.status}</td>
                  <td className="px-4 py-4 text-right">
                    <button className="font-medium text-amber-600 hover:text-amber-700">
                      Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
