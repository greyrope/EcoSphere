const mockCampaigns = [
  {
    id: 1,
    name: 'Local River Cleanup',
    participants: 45,
    goal: 50,
    status: 'Active',
  },
  {
    id: 2,
    name: 'STEM Mentorship Program',
    participants: 12,
    goal: 20,
    status: 'Active',
  },
  {
    id: 3,
    name: 'Winter Clothes Drive',
    participants: 120,
    goal: 100,
    status: 'Completed',
  },
];

export default function Social() {
  return (
    <div className="mx-auto max-w-7xl space-y-8 p-8">
      <header className="flex items-center justify-between border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Social Impact
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage CSR initiatives, diversity metrics, and community engagement.
          </p>
        </div>
        <button className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700">
          Create CSR Campaign
        </button>
      </header>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="rounded-xl border border-t-4 border-slate-200 border-t-indigo-500 bg-white p-6 shadow-sm">
          <h3 className="text-sm font-medium text-slate-500">
            Total Volunteer Hours
          </h3>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900">1,240</span>
            <span className="text-sm font-medium text-slate-500">hrs</span>
          </div>
        </div>
        <div className="rounded-xl border border-t-4 border-slate-200 border-t-indigo-400 bg-white p-6 shadow-sm">
          <h3 className="text-sm font-medium text-slate-500">
            Workforce Diversity
          </h3>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900">48</span>
            <span className="text-sm font-medium text-slate-500">%</span>
          </div>
        </div>
        <div className="rounded-xl border border-t-4 border-slate-200 border-t-indigo-300 bg-white p-6 shadow-sm">
          <h3 className="text-sm font-medium text-slate-500">
            Active CSR Campaigns
          </h3>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900">4</span>
          </div>
        </div>
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">
          CSR Campaigns Overview
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3 font-medium">Campaign Name</th>
                <th className="px-4 py-3 font-medium">Participation</th>
                <th className="px-4 py-3 font-medium">Progress</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mockCampaigns.map((camp) => (
                <tr key={camp.id} className="hover:bg-slate-50">
                  <td className="px-4 py-4 font-medium text-slate-900">
                    {camp.name}
                  </td>
                  <td className="px-4 py-4 text-slate-600">
                    {camp.participants} / {camp.goal} Employees
                  </td>
                  <td className="px-4 py-4">
                    <div className="h-2 w-24 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full bg-indigo-500"
                        style={{
                          width: `${Math.min((camp.participants / camp.goal) * 100, 100)}%`,
                        }}
                      ></div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`rounded-md px-2 py-1 text-xs font-medium ${camp.status === 'Active' ? 'bg-indigo-50 text-indigo-700' : 'bg-slate-100 text-slate-600'}`}
                    >
                      {camp.status}
                    </span>
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
