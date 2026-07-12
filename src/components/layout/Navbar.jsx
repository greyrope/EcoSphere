import React from 'react';

export default function Navbar({
  title = 'Dashboard',
  userName = 'Alex Chen',
  avatarInitials,
  onNotificationClick,
}) {
  const initials =
    avatarInitials ??
    userName
      .split(' ')
      .map((part) => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-1 items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-600 text-sm font-semibold text-white">
            E
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-900">EcoSphere</p>
            <p className="text-sm text-gray-500">Sustainability Hub</p>
          </div>
        </div>

        <div className="flex-1 text-center">
          <h1 className="text-lg font-semibold text-gray-800">{title}</h1>
        </div>

        <div className="flex flex-1 items-center justify-end gap-3">
          <button
            type="button"
            onClick={onNotificationClick}
            className="rounded-full p-2 text-gray-600 transition hover:bg-gray-100 hover:text-green-600"
            aria-label="Notifications"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14.857 17.082A23.848 23.848 0 0015 18c0 1.657-1.343 3-3 3s-3-1.343-3-3c0-.038.001-.076.003-.113a23.848 23.848 0 00.143-1.918M9.5 8.5a2.5 2.5 0 115 0c0 2.5 1 3.5 1 5.5H8.5c0-2 1-3 1-5.5z"
              />
            </svg>
          </button>

          <div className="flex items-center gap-3 rounded-full border border-gray-200 bg-gray-50 px-2 py-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-600 text-sm font-semibold text-white">
              {initials}
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-gray-900">{userName}</p>
              <p className="text-xs text-gray-500">Admin</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
