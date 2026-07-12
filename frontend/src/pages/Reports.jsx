import { useState } from 'react';

export default function Reports() {
  const [filters, setFilters] = useState({
    dateRange: 'Q3 2026',
    department: 'All Departments',
    module: 'All Modules',
    category: 'All Categories',
  });

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-8">
      {/* Header */}
      <header className="border-b border-slate-200 pb-5">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Custom Report Builder
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Combine filters to generate and export targeted ESG compliance
          reports.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* 1. FILTER PANEL */}
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-1">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">
            Report Parameters
          </h2>

          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Date Range
              </label>
              <select
                name="dateRange"
                onChange={handleFilterChange}
                className="w-full rounded-lg border border-slate-300 bg-slate-50 p-2.5 text-sm text-slate-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
              >
                <option>Q3 2026</option>
                <option>Q2 2026</option>
                <option>Year to Date</option>
                <option>Last 12 Months</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Department
              </label>
              <select
                name="department"
                onChange={handleFilterChange}
                className="w-full rounded-lg border border-slate-300 bg-slate-50 p-2.5 text-sm text-slate-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
              >
                <option>All Departments</option>
                <option>Manufacturing</option>
                <option>Logistics</option>
                <option>Corporate</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Platform Module
              </label>
              <select
                name="module"
                onChange={handleFilterChange}
                className="w-full rounded-lg border border-slate-300 bg-slate-50 p-2.5 text-sm text-slate-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
              >
                <option>All Modules</option>
                <option>Environmental</option>
                <option>Social (CSR)</option>
                <option>Governance</option>
                <option>Gamification</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                ESG Category
              </label>
              <select
                name="category"
                onChange={handleFilterChange}
                className="w-full rounded-lg border border-slate-300 bg-slate-50 p-2.5 text-sm text-slate-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
              >
                <option>All Categories</option>
                <option>Carbon Accounting</option>
                <option>Diversity Metrics</option>
                <option>Audits</option>
              </select>
            </div>

            <button className="mt-4 w-full rounded-lg bg-slate-900 py-2.5 text-sm font-medium text-white transition-colors hover:bg-slate-800">
              Apply Filters
            </button>
          </div>
        </section>

        {/* 2. REPORT PREVIEW & EXPORT */}
        <section className="flex flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
          <div className="mb-4 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <h2 className="text-lg font-semibold text-slate-900">
              Data Preview
            </h2>

            {/* Export Buttons */}
            <div className="flex gap-2">
              <button className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50">
                <span>📄</span> PDF
              </button>
              <button className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50">
                <span>📊</span> Excel
              </button>
              <button className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50">
                <span>📝</span> CSV
              </button>
            </div>
          </div>

          {/* Dynamic Preview State */}
          <div className="flex flex-1 flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 p-12 text-center">
            <div className="mb-2 text-4xl">🗂️</div>
            <h3 className="mb-1 font-medium text-slate-900">
              Ready to Generate
            </h3>
            <p className="text-sm text-slate-500">
              Querying data for <strong>{filters.department}</strong> across{' '}
              <strong>{filters.module}</strong> for{' '}
              <strong>{filters.dateRange}</strong>.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
