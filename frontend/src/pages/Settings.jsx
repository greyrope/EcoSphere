import { useState } from 'react';

// --- MOCK DATA ---
const mockCategories = [
  { id: 1, name: 'Environmental Impact', type: 'Challenge', status: 'Active' },
  { id: 2, name: 'Tree Plantation', type: 'CSR Activity', status: 'Active' },
  { id: 3, name: 'Community Cleanup', type: 'CSR Activity', status: 'Active' },
  { id: 4, name: 'Commuting & Travel', type: 'Challenge', status: 'Active' },
  {
    id: 5,
    name: 'Health & Well-being',
    type: 'CSR Activity',
    status: 'Archived',
  },
];

const mockDepartments = [
  {
    id: 1,
    name: 'Manufacturing',
    code: 'MFG',
    head: 'S. Nair',
    parent: '-',
    employees: 124,
    status: 'Active',
  },
  {
    id: 2,
    name: 'Logistics',
    code: 'LOG',
    head: 'D. Iyer',
    parent: 'Manufacturing',
    employees: 58,
    status: 'Active',
  },
  {
    id: 3,
    name: 'Corporate',
    code: 'CORP',
    head: 'A. Mehta',
    parent: '-',
    employees: 42,
    status: 'Active',
  },
];

const mockToggles = [
  {
    id: 'autoEmission',
    title: 'Auto Emission Calculation',
    description:
      'Automatically calculate carbon transactions from linked ERP records using standard emission factors.',
    enabled: true,
  },
  {
    id: 'evidenceReq',
    title: 'CSR Evidence Requirement',
    description:
      'Require employees to upload proof (photo/document) before a CSR activity can be approved.',
    enabled: true,
  },
  {
    id: 'autoBadge',
    title: 'Auto-Award Badges',
    description:
      'Automatically unlock and assign badges to employees when they hit XP milestones.',
    enabled: true,
  },
  {
    id: 'notifications',
    title: 'System Notifications',
    description:
      'Send in-app and email alerts for new compliance issues, CSR approvals, and policy reminders.',
    enabled: true,
  },
];

export default function Settings() {
  const [activeTab, setActiveTab] = useState('Configuration');
  const tabs = ['Configuration', 'Departments', 'Categories'];

  // Local state for toggles so they actually animate when clicked
  const [toggles, setToggles] = useState(mockToggles);

  const handleToggle = (id) => {
    setToggles(
      toggles.map((t) => (t.id === id ? { ...t, enabled: !t.enabled } : t))
    );
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-8">
      {/* Header */}
      <header className="border-b border-slate-200 pb-5">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Settings & Administration
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage master data, organizational hierarchy, and platform business
          rules.
        </p>
      </header>

      {/* Navigation Tabs */}
      <div className="flex gap-4 border-b border-slate-200">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === tab
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* TAB CONTENT: Configuration & Business Rules */}
      {activeTab === 'Configuration' && (
        <section className="max-w-3xl space-y-6">
          <h2 className="text-lg font-semibold text-slate-900">
            Core Business Rules
          </h2>
          <div className="space-y-4">
            {toggles.map((toggle) => (
              <div
                key={toggle.id}
                className="flex items-start justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="pr-8">
                  <h3 className="font-semibold text-slate-800">
                    {toggle.title}
                  </h3>
                  <p className="text-sm text-slate-500">{toggle.description}</p>
                </div>
                {/* Tailwind Custom Toggle Switch */}
                <button
                  onClick={() => handleToggle(toggle.id)}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 focus:outline-none ${
                    toggle.enabled ? 'bg-emerald-500' : 'bg-slate-200'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      toggle.enabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* TAB CONTENT: Departments Management */}
      {activeTab === 'Departments' && (
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">
              Organizational Hierarchy
            </h2>
            <button className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800">
              + Add Department
            </button>
          </div>
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-6 py-4 font-medium">Name</th>
                  <th className="px-6 py-4 font-medium">Code</th>
                  <th className="px-6 py-4 font-medium">Head</th>
                  <th className="px-6 py-4 font-medium">Parent Dept</th>
                  <th className="px-6 py-4 font-medium">Employees</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {mockDepartments.map((dept) => (
                  <tr
                    key={dept.id}
                    className="transition-colors hover:bg-slate-50"
                  >
                    <td className="px-6 py-4 font-semibold text-slate-900">
                      {dept.name}
                    </td>
                    <td className="px-6 py-4 text-slate-500">{dept.code}</td>
                    <td className="px-6 py-4 text-slate-700">{dept.head}</td>
                    <td className="px-6 py-4 text-slate-500">{dept.parent}</td>
                    <td className="px-6 py-4 text-slate-700">
                      {dept.employees}
                    </td>
                    <td className="px-6 py-4">
                      <span className="rounded-md bg-emerald-50 px-2 py-1 text-xs font-medium tracking-wider text-emerald-700 uppercase">
                        {dept.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* TAB CONTENT: Categories (Placeholder for completeness) */}
      {/* TAB CONTENT: Categories Management */}
      {activeTab === 'Categories' && (
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">
              Category Management
            </h2>
            <button className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800 focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 focus:outline-none">
              + Add Category
            </button>
          </div>
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-6 py-4 font-medium">Name</th>
                  <th className="px-6 py-4 font-medium">Type</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {mockCategories.map((category) => (
                  <tr
                    key={category.id}
                    className="transition-colors hover:bg-slate-50"
                  >
                    <td className="px-6 py-4 font-semibold text-slate-900">
                      {category.name}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          category.type === 'CSR Activity'
                            ? 'bg-indigo-50 text-indigo-700'
                            : 'bg-orange-50 text-orange-700'
                        }`}
                      >
                        {category.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`rounded-md px-2 py-1 text-xs font-medium tracking-wider uppercase ${
                          category.status === 'Active'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {category.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-sm font-medium text-slate-400 transition-colors hover:text-emerald-600">
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
