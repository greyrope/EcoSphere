import { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

// --- SKELETON LOADER COMPONENT ---
const DashboardSkeleton = () => (
  <div className="animate-pulse space-y-8">
    {/* Header Skeleton */}
    <div className="flex items-center justify-between border-b border-slate-200 pb-5">
      <div className="space-y-3">
        <div className="h-6 w-48 rounded bg-slate-200"></div>
        <div className="h-4 w-64 rounded bg-slate-100"></div>
      </div>
      <div className="flex gap-3">
        <div className="h-9 w-24 rounded-lg bg-slate-200"></div>
        <div className="h-9 w-32 rounded-lg bg-emerald-200/50"></div>
      </div>
    </div>

    {/* Top Metrics Skeleton */}
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm"
        >
          <div className="mb-4 h-4 w-24 rounded bg-slate-200"></div>
          <div className="mb-4 h-10 w-32 rounded bg-slate-200"></div>
          <div className="h-4 w-40 rounded bg-slate-100"></div>
        </div>
      ))}
    </div>

    {/* Charts Skeleton */}
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
      <div className="h-80 rounded-xl bg-slate-100 lg:col-span-2"></div>
      <div className="h-80 rounded-xl bg-slate-100"></div>
    </div>
  </div>
);

// --- MOCK DATA ---
const scores = { overall: 82, environmental: 74, social: 88, governance: 81 };

const departmentRankings = [
  { id: 'mfg', name: 'Manufacturing', score: 85, color: 'bg-emerald-500' },
  { id: 'corp', name: 'Corporate', score: 78, color: 'bg-emerald-400' },
  { id: 'log', name: 'Logistics', score: 72, color: 'bg-emerald-300' },
  { id: 'sales', name: 'Sales', score: 65, color: 'bg-amber-400' },
];

const recentActivity = [
  {
    id: 1,
    text: 'Priya completed "Zero Waste Week"',
    time: '2 hours ago',
    icon: '🏅',
  },
  {
    id: 2,
    text: 'New compliance issue flagged in Logistics',
    time: '5 hours ago',
    icon: '⚠️',
  },
  {
    id: 3,
    text: 'Q3 Carbon Emissions synced from ERP',
    time: '1 day ago',
    icon: '🌍',
  },
];

const requiresAttention = [
  {
    id: 101,
    text: "Review Aditi's Tree Plantation Proof",
    type: 'CSR Approval',
    urgent: false,
  },
  {
    id: 102,
    text: 'Overdue: Missing MSDS Audit in Mfg',
    type: 'Compliance',
    urgent: true,
  },
];

const emissionTrendData = [
  { month: 'Jan', emissions: 400 },
  { month: 'Feb', emissions: 450 },
  { month: 'Mar', emissions: 420 },
  { month: 'Apr', emissions: 500 },
  { month: 'May', emissions: 480 },
  { month: 'Jun', emissions: 410 },
  { month: 'Jul', emissions: 390 },
  { month: 'Aug', emissions: 350 },
  { month: 'Sep', emissions: 320 },
  { month: 'Oct', emissions: 290 },
  { month: 'Nov', emissions: 310 },
  { month: 'Dec', emissions: 280 },
];

// --- SUB-COMPONENTS ---
const ScoreCard = ({ title, score, target, trend, accentColor }) => (
  <div
    className={`rounded-xl border border-t-4 border-slate-200 bg-white p-6 shadow-sm ${accentColor}`}
  >
    <h3 className="text-sm font-medium text-slate-500">{title}</h3>
    <div className="mt-2 flex items-baseline gap-2">
      <span className="text-4xl font-bold text-slate-900">{score}</span>
      <span className="text-sm font-medium text-slate-500">/ {target}</span>
    </div>
    <div className="mt-4 flex items-center text-sm">
      <span
        className={`font-medium ${trend.startsWith('+') ? 'text-emerald-600' : 'text-rose-500'}`}
      >
        {trend}
      </span>
      <span className="ml-2 text-slate-500">vs last quarter</span>
    </div>
  </div>
);

export default function Dashboard() {
  const [sortOrder, setSortOrder] = useState('desc');
  const [isLoading, setIsLoading] = useState(true);
  const [currentWeights, setCurrentWeights] = useState('40 / 30 / 30');

  // Simulate a network request loading time
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200); // 1.2 seconds
    return () => clearTimeout(timer);
  }, []);

  const sortedDepartments = [...departmentRankings].sort((a, b) => {
    return sortOrder === 'desc' ? b.score - a.score : a.score - b.score;
  });

  const handleExport = () => {
    const payload = {
      scores,
      departments: sortedDepartments,
      attention: requiresAttention,
      activity: recentActivity,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json',
    });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'ecosphere-dashboard-summary.json';
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const handleConfigureWeights = () => {
    const nextWeights = window.prompt(
      'Set ESG weights as E / S / G',
      currentWeights
    );
    if (nextWeights) {
      setCurrentWeights(nextWeights);
      alert(`Saved new ESG weights: ${nextWeights}`);
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-8">
      {/* Conditional Rendering: Show Skeleton OR the Dashboard */}
      {isLoading ? (
        <DashboardSkeleton />
      ) : (
        <div className="animate-in fade-in space-y-8 duration-500">
          {/* Header */}
          <header className="flex items-center justify-between border-b border-slate-200 pb-5">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Executive Overview
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Real-time ESG performance and compliance tracking.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleExport}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
              >
                Export PDF
              </button>
              <button
                onClick={handleConfigureWeights}
                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-emerald-700"
              >
                Configure Weights
              </button>
            </div>
          </header>

          {/* 1. TOP METRICS: ESG Scores */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <ScoreCard
              title="Overall ESG Score"
              score={scores.overall}
              target={100}
              trend="+4.2%"
              accentColor="border-t-emerald-500"
            />
            <ScoreCard
              title="Environmental (40%)"
              score={scores.environmental}
              target={100}
              trend="-1.5%"
              accentColor="border-t-sky-500"
            />
            <ScoreCard
              title="Social (30%)"
              score={scores.social}
              target={100}
              trend="+8.4%"
              accentColor="border-t-indigo-500"
            />
            <ScoreCard
              title="Governance (30%)"
              score={scores.governance}
              target={100}
              trend="+2.1%"
              accentColor="border-t-amber-500"
            />
          </div>

          {/* 2. MIDDLE SECTION: Charts & Visuals */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Dynamic Line Chart */}
            <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900">
                  Emissions Trend (12 mo)
                </h2>
                <button className="flex items-center gap-1 text-sm font-medium text-emerald-600 hover:text-emerald-700">
                  <span className="text-xl">+</span> Log Data
                </button>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={emissionTrendData}>
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
                    <Line
                      type="monotone"
                      dataKey="emissions"
                      stroke="#10b981"
                      strokeWidth={3}
                      dot={{ r: 4, fill: '#10b981', strokeWidth: 0 }}
                      activeDot={{ r: 6, strokeWidth: 0 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </section>

            {/* Dynamic Department Rankings */}
            <section className="flex flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900">
                  Dept Rankings
                </h2>
                <button
                  onClick={() =>
                    setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')
                  }
                  className="rounded bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-200"
                >
                  {sortOrder === 'desc' ? 'Top Performers ↓' : 'Needs Work ↑'}
                </button>
              </div>
              <div className="flex flex-1 flex-col justify-center space-y-6">
                {sortedDepartments.map((dept, index) => (
                  <div key={dept.id}>
                    <div className="mb-2 flex justify-between text-sm">
                      <span className="font-medium text-slate-800">
                        {index + 1}. {dept.name}
                      </span>
                      <span className="font-bold text-slate-900">
                        {dept.score}{' '}
                        <span className="font-normal text-slate-500">pts</span>
                      </span>
                    </div>
                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={`h-full rounded-full ${dept.color} transition-all duration-700 ease-out`}
                        style={{ width: `${dept.score}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* 3. BOTTOM SECTION: Actions & Activity */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Requires Attention (Action Queue) */}
            <section className="rounded-xl border border-l-4 border-slate-200 border-l-rose-500 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-slate-900">
                Requires Attention
              </h2>
              <div className="space-y-3">
                {requiresAttention.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 p-4 transition-colors hover:bg-slate-100"
                  >
                    <div>
                      <div className="mb-1 flex items-center gap-2">
                        <span
                          className={`text-xs font-bold tracking-wider uppercase ${task.urgent ? 'text-rose-600' : 'text-slate-500'}`}
                        >
                          {task.type}
                        </span>
                        {task.urgent && (
                          <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-700">
                            URGENT
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-medium text-slate-800">
                        {task.text}
                      </p>
                    </div>
                    <button
                      onClick={() => alert(`Opening review for ${task.text}`)}
                      className="rounded-lg bg-slate-900 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-slate-800"
                    >
                      Review
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {/* Recent Activity Feed */}
            <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900">
                  Recent Activity
                </h2>
                <button
                  onClick={() => window.alert(`Dashboard weights: ${currentWeights}`)}
                  className="text-sm font-medium text-emerald-600 hover:text-emerald-700"
                >
                  View All
                </button>
              </div>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-3 border-b border-slate-100 pb-4 last:border-0 last:pb-0"
                  >
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-slate-50 text-sm">
                      {activity.icon}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-800">
                        {activity.text}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-500">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      )}
    </div>
  );
}
