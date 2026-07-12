import { Link, Outlet, useLocation } from 'react-router-dom';
import { useGlobal } from '../context/GlobalContext';

export default function Layout() {
  const location = useLocation();
  const { user } = useGlobal();

  const isActive = (path) =>
    location.pathname === path
      ? 'bg-emerald-50 text-emerald-700 font-semibold'
      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900';

  const getInitials = (name) =>
    name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase();

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌍</span>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Eco<span className="text-emerald-600">Sphere</span>
            </h1>
          </div>

          <nav className="hidden gap-1 md:flex">
            {[
              ['/', 'Dashboard'],
              ['/environmental', 'Environmental'],
              ['/social', 'Social'],
              ['/governance', 'Governance'],
              ['/gamification', 'Gamification'],
              ['/reports', 'Reports'],
              ['/settings', 'Settings'],
            ].map(([path, label]) => (
              <Link
                key={path}
                to={path}
                className={`rounded-md px-3 py-2 text-sm transition-colors ${isActive(path)}`}
              >
                {label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <button className="text-slate-400 transition-colors hover:text-slate-600">
              <span className="text-xl">🔔</span>
            </button>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-sm font-medium text-white shadow-sm">
              {getInitials(user.name)}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 pb-12">
        <Outlet />
      </main>
    </div>
  );
}
