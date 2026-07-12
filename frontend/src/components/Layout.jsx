import { Link, Outlet } from 'react-router-dom';
import Navbar from './layout/Navbar';

export default function Layout() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="flex w-64 flex-col bg-gray-900 p-4 text-white">
        <h2 className="mb-8 text-xl font-bold text-green-400">EcoSphere</h2>
        <nav className="flex flex-col gap-4">
          <Link to="/" className="transition hover:text-green-300">
            Dashboard
          </Link>
          <Link to="/environmental" className="transition hover:text-green-300">
            Environmental
          </Link>
          <Link to="/social" className="transition hover:text-green-300">
            Social
          </Link>
          <Link to="/governance" className="transition hover:text-green-300">
            Governance
          </Link>
          <Link to="/gamification" className="transition hover:text-green-300">
            Gamification
          </Link>
          <Link to="/reports" className="transition hover:text-green-300">
            Reports
          </Link>
          <Link to="/settings" className="transition hover:text-green-300">
            Settings
          </Link>
        </nav>
      </aside>

      <div className="flex flex-1 flex-col">
        <Navbar title="Dashboard" userName="Srishti Priya" />

        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
