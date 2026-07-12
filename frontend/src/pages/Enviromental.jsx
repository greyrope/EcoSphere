import { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const mockEmissionsData = [
  { month: 'Jan', actual: 400, target: 450 },
  { month: 'Feb', actual: 450, target: 440 },
  { month: 'Mar', actual: 420, target: 430 },
  { month: 'Apr', actual: 500, target: 420 },
  { month: 'May', actual: 480, target: 410 },
  { month: 'Jun', actual: 410, target: 400 },
];

const mockLogs = [
  {
    id: 1,
    source: 'ERP Sync (Logistics)',
    type: 'Scope 1',
    amount: '124 tCO2e',
    date: 'Today, 09:41 AM',
  },
  {
    id: 2,
    source: 'Electricity Bill (HQ)',
    type: 'Scope 2',
    amount: '45 tCO2e',
    date: 'Yesterday, 14:20 PM',
  },
  {
    id: 3,
    source: 'Employee Commute',
    type: 'Scope 3',
    amount: '12 tCO2e',
    date: 'Aug 14, 08:00 AM',
  },
];

export default function Environmental() {
  const [logs, setLogs] = useState(mockLogs);

  const handleLogResource = () => {
    const source = window.prompt('Enter resource source', 'Manual Entry');
    if (!source) {
      return;
    }

    setLogs((current) => [
      {
        id: Date.now(),
        source,
        type: 'Scope 2',
        amount: '0 tCO2e',
        date: new Date().toLocaleString(),
      },
      ...current,
    ]);
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-8">
      <header className="flex items-center justify-between border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Environmental Data
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Track carbon emissions, resource usage, and Scope 1-3 footprint.
          </p>
        </div>
        <button
          onClick={handleLogResource}
          className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-sky-700"
        >
          + Log Resource Data
        </button>
      </header>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {/* Quick Stats */}
        <div className="rounded-xl border border-t-4 border-slate-200 border-t-sky-500 bg-white p-6 shadow-sm">
          <h3 className="text-sm font-medium text-slate-500">
            Total Emissions (YTD)
          </h3>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900">2,660</span>
            <span className="text-sm font-medium text-slate-500">tCO2e</span>
          </div>
        </div>
        <div className="rounded-xl border border-t-4 border-slate-200 border-t-sky-400 bg-white p-6 shadow-sm">
          <h3 className="text-sm font-medium text-slate-500">
            Renewable Energy Mix
          </h3>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900">42</span>
            <span className="text-sm font-medium text-slate-500">%</span>
          </div>
        </div>
        <div className="rounded-xl border border-t-4 border-slate-200 border-t-sky-300 bg-white p-6 shadow-sm">
          <h3 className="text-sm font-medium text-slate-500">
            Water Consumption
          </h3>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900">14.2</span>
            <span className="text-sm font-medium text-slate-500">kL / mo</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
          <h2 className="mb-6 text-lg font-semibold text-slate-900">
            Emissions vs Targets
          </h2>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockEmissionsData}>
                <defs>
                  <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#e2e8f0"
                />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: '8px',
                    border: 'none',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="actual"
                  stroke="#0ea5e9"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorActual)"
                />
                <Area
                  type="monotone"
                  dataKey="target"
                  stroke="#94a3b8"
                  strokeDasharray="5 5"
                  fillOpacity={0}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">
            Recent Data Logs
          </h2>
          <div className="space-y-4">
            {logs.map((log) => (
              <div
                key={log.id}
                className="border-b border-slate-100 pb-3 last:border-0 last:pb-0"
              >
                <div className="flex justify-between">
                  <span className="text-sm font-semibold text-slate-800">
                    {log.source}
                  </span>
                  <span className="rounded bg-sky-50 px-2 py-0.5 text-xs font-medium text-sky-700">
                    {log.type}
                  </span>
                </div>
                <div className="mt-1 flex justify-between text-sm text-slate-500">
                  <span>{log.amount}</span>
                  <span className="text-xs">{log.date}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
