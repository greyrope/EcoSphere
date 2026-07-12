import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useGlobal } from '../context/GlobalContext';

export default function Layout() {
  const location = useLocation();
  const { user, notifications } = useGlobal();

  // UI States (Profile dropdown state is completely removed)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  // Close menus on navigation
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsNotifOpen(false);
  }, [location.pathname]);

  const isActive = (path) => {
    return location.pathname === path
      ? 'bg-slate-900 text-white font-medium shadow-sm'
      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900';
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  const navLinks = [
    { name: 'Dashboard', path: '/' },
    { name: 'Environmental', path: '/environmental' },
    { name: 'Social', path: '/social' },
    { name: 'Governance', path: '/governance' },
    { name: 'Gamification', path: '/gamification' },
    { name: 'Reports', path: '/reports' },
    { name: 'Settings', path: '/settings' },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900 antialiased">
      {/* Premium Top Navigation Bar */}
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Brand Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 transition-opacity hover:opacity-90"
          >
            <svg
              className="h-6 w-6 text-emerald-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m11.314 11.314l.707.707M12 5a7 7 0 100 14 7 7 0 000-14z"
              />
            </svg>
            <span className="text-lg font-bold tracking-tight text-slate-900">
              Eco<span className="font-medium text-emerald-600">Sphere</span>
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-all ${isActive(link.path)}`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Action Hub */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Notification Trigger & Panel */}
            <div className="relative">
              <button
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className={`relative rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 ${isNotifOpen ? 'bg-slate-100 text-slate-900' : ''}`}
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
                  />
                </svg>
                {notifications.length > 0 && (
                  <span className="absolute top-2.5 right-2.5 block h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-white"></span>
                )}
              </button>

              {isNotifOpen && (
                <div className="absolute right-0 mt-2 w-80 origin-top-right rounded-xl border border-slate-200/70 bg-white/75 p-2 shadow-xl ring-1 ring-black/5 backdrop-blur-lg">
                  <div className="flex items-center justify-between border-b border-slate-100 px-3 pt-1 pb-2">
                    <span className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
                      Updates
                    </span>
                    <button className="text-xs font-medium text-emerald-600 hover:text-emerald-700">
                      Clear all
                    </button>
                  </div>
                  <div className="mt-1 max-h-60 overflow-y-auto">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className="rounded-lg px-3 py-2.5 transition-colors hover:bg-slate-50/60"
                      >
                        <p className="text-sm font-medium text-slate-700">
                          {n.message}
                        </p>
                        <p className="mt-0.5 text-[11px] text-slate-400">
                          Just now
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Link (No longer a dropdown menu) */}
            <Link
              to="/profile"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200/50 bg-slate-100 text-xs font-semibold text-slate-600 transition-all hover:bg-slate-200 hover:ring-2 hover:ring-slate-900 hover:ring-offset-2"
              title="Go to Profile"
            >
              {getInitials(user.name)}
            </Link>

            {/* Mobile Navigation Trigger */}
            <div className="ml-1 flex items-center md:hidden">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(!isMobileMenuOpen);
                  setIsNotifOpen(false);
                }}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 focus:outline-none"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                >
                  {isMobileMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="absolute top-16 left-0 w-full border-b border-slate-200 bg-white/95 shadow-lg backdrop-blur-md md:hidden">
            <div className="space-y-1 px-4 py-3">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`block rounded-lg px-3 py-2 text-base font-medium transition-all ${isActive(link.path)}`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>

      <main className="flex-1 pb-12">
        <Outlet />
      </main>
    </div>
  );
}
