import { useState } from 'react';
import { useGlobal } from '../context/GlobalContext.jsx';
import { esgService } from '../services/api';

// --- MOCK DATA ---
const mockRewards = [
  { id: 1, name: 'Extra WFH Day', points: 5000, stock: 'Unlimited' },
  { id: 2, name: 'Eco-Friendly Coffee Mug', points: 1500, stock: 12 },
  { id: 3, name: '$50 Vegan Restaurant Gift Card', points: 3000, stock: 0 },
];

const mockChallenges = [
  {
    id: 1,
    title: 'Sustainability Sprint',
    category: 'Environmental',
    xp: 100,
    difficulty: 'Hard',
    status: 'Active',
  },
  {
    id: 2,
    title: 'Zero Waste Lunch',
    category: 'Social',
    xp: 50,
    difficulty: 'Easy',
    status: 'Active',
  },
  {
    id: 3,
    title: 'Energy Audit',
    category: 'Governance',
    xp: 150,
    difficulty: 'Medium',
    status: 'Under Review',
  },
  {
    id: 4,
    title: 'Commute Green Week',
    category: 'Environmental',
    xp: 75,
    difficulty: 'Medium',
    status: 'Completed',
  },
];

const mockBadges = [
  { id: 1, name: 'Carbon Conqueror', icon: '🌍', unlocked: true },
  { id: 2, name: 'Earth Savior', icon: '🌱', unlocked: true },
  { id: 3, name: 'Governance Guru', icon: '📜', unlocked: false },
  { id: 4, name: 'Team Player', icon: '🤝', unlocked: true },
];

const mockLeaderboard = [
  { rank: 1, name: 'Manufacturing Dept', xp: 4500, trend: '+120' },
  { rank: 2, name: 'Aditi Rao', xp: 3250, trend: '+50' },
  { rank: 3, name: 'Corporate Dept', xp: 2100, trend: '-20' },
];

// --- SUB-COMPONENTS (Keeps the main render clean) ---

const ChallengeCard = ({ challenge }) => (
  <div className="group flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:shadow-md">
    <div>
      <div className="mb-3 flex items-start justify-between">
        <h3 className="font-semibold text-slate-800">{challenge.title}</h3>
        <span
          className={`rounded-md px-2 py-1 text-xs font-medium tracking-wider uppercase ${
            challenge.status === 'Active'
              ? 'bg-emerald-50 text-emerald-700'
              : challenge.status === 'Completed'
                ? 'bg-slate-100 text-slate-600'
                : 'bg-amber-50 text-amber-700'
          }`}
        >
          {challenge.status}
        </span>
      </div>
      <div className="mb-4 flex items-center gap-3 text-sm text-slate-500">
        <span className="flex items-center gap-1">
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
          {challenge.xp} XP
        </span>
        <span>•</span>
        <span>{challenge.difficulty}</span>
        <span>•</span>
        <span>{challenge.category}</span>
      </div>
    </div>
    <button className="w-full rounded-lg bg-slate-50 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900 focus:ring-2 focus:ring-slate-200 focus:outline-none">
      View Details
    </button>
  </div>
);

const BadgeItem = ({ badge }) => (
  <div
    className={`flex items-center gap-4 rounded-xl border p-4 shadow-sm ${badge.unlocked ? 'border-slate-200 bg-white' : 'border-slate-100 bg-slate-50 opacity-60 grayscale'}`}
  >
    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-2xl">
      {badge.icon}
    </div>
    <div>
      <p className="font-medium text-slate-800">{badge.name}</p>
      <p className="text-xs text-slate-500">
        {badge.unlocked ? 'Unlocked' : 'Locked'}
      </p>
    </div>
  </div>
);

// --- MAIN PAGE COMPONENT ---

export default function Gamification() {
  const { user, deductXP } = useGlobal();
  const [activeTab, setActiveTab] = useState('Active');
  const tabs = ['Draft', 'Active', 'Under Review', 'Completed', 'Archived'];

  // Derived state: Automatically filter challenges based on the selected tab
  const filteredChallenges = mockChallenges.filter(
    (c) => c.status === activeTab
  );

  const handleRedeem = (rewardName, cost) => {
    const success = deductXP(cost);
    if (success) {
      esgService.redeemReward(rewardName).catch(() => null);
      alert(`Successfully redeemed ${rewardName}!`);
    } else {
      alert('Not enough XP!');
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-8">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Gamification Hub
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage sustainability challenges and track employee engagement.
          </p>
        </div>
        <button className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800 focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 focus:outline-none">
          + Create Challenge
        </button>
      </header>

      {/* Challenges Section */}
      <section>
        <div className="mb-6 flex gap-2 overflow-x-auto border-b border-slate-200">
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

        {filteredChallenges.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredChallenges.map((challenge) => (
              <ChallengeCard key={challenge.id} challenge={challenge} />
            ))}
          </div>
        ) : (
          <div className="flex rounded-xl border border-dashed border-slate-300 bg-slate-50 py-12 text-center text-slate-500">
            <div className="mx-auto">No challenges found in this status.</div>
          </div>
        )}
      </section>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Badge Gallery */}
        <section>
          <h2 className="mb-4 text-lg font-semibold text-slate-900">
            Badge Gallery
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {mockBadges.map((badge) => (
              <BadgeItem key={badge.id} badge={badge} />
            ))}
          </div>
        </section>

        {/* Leaderboard */}
        <section>
          <h2 className="mb-4 text-lg font-semibold text-slate-900">
            Top Performers
          </h2>
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-6 py-4 font-medium">Rank</th>
                  <th className="px-6 py-4 font-medium">Name</th>
                  <th className="px-6 py-4 text-right font-medium">Total XP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {mockLeaderboard.map((row) => (
                  <tr
                    key={row.rank}
                    className="transition-colors hover:bg-slate-50"
                  >
                    <td className="px-6 py-4 font-semibold text-slate-900">
                      #{row.rank}
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-700">
                      {row.name}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="font-semibold text-slate-900">
                        {row.xp.toLocaleString()}
                      </span>
                      <span
                        className={`ml-2 text-xs ${row.trend.startsWith('+') ? 'text-emerald-600' : 'text-rose-500'}`}
                      >
                        {row.trend}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
        {/* Rewards Catalog */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">
              Rewards Catalog
            </h2>
            <span className="text-sm font-medium text-slate-500">
              Your Balance:{' '}
              <span className="font-bold text-emerald-600">
                {user.xpBalance.toLocaleString()} XP
              </span>
            </span>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {mockRewards.map((reward) => (
              <div
                key={reward.id}
                className={`flex flex-col justify-between rounded-xl border p-5 ${reward.stock === 0 ? 'bg-slate-50 opacity-60' : 'bg-white shadow-sm'}`}
              >
                <div>
                  <h3 className="font-semibold text-slate-800">
                    {reward.name}
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    {reward.points.toLocaleString()} Points Required
                  </p>
                  <p
                    className={`mt-2 text-xs font-bold tracking-wider uppercase ${reward.stock === 0 ? 'text-rose-500' : 'text-slate-400'}`}
                  >
                    {reward.stock === 0
                      ? 'Out of Stock'
                      : `Stock: ${reward.stock}`}
                  </p>
                </div>
                <button
                  disabled={
                    reward.stock === 0 || user.xpBalance < reward.points
                  }
                  onClick={() => handleRedeem(reward.name, reward.points)}
                  className="mt-4 w-full rounded-lg bg-slate-900 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800 disabled:bg-slate-300 disabled:text-slate-500"
                >
                  {user.xpBalance < reward.points
                    ? 'Not Enough XP'
                    : 'Redeem Reward'}
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
