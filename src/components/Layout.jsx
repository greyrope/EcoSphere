import { Link, Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar Navigation */}
      <aside className="flex w-64 flex-col bg-gray-900 p-4 text-white">
        <h2 className="mb-8 text-xl font-bold text-green-400">EcoSphere</h2>
        <nav className="flex flex-col gap-4">
          <Link to="/" className="hover:text-green-300">
            Dashboard
          </Link>
          <Link to="/environmental" className="hover:text-green-300">
            Environmental
          </Link>
          <Link to="/social" className="hover:text-green-300">
            Social
          </Link>
          <Link to="/governance" className="hover:text-green-300">
            Governance
          </Link>
          <Link to="/gamification" className="hover:text-green-300">
            Gamification
          </Link>
        </nav>
      </aside>

      {/* Main Page Content */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
