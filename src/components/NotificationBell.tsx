import React from 'react';

interface NotificationBellProps {
  notificationCount: number;
  hasUnread?: boolean;
}

const NotificationBell: React.FC<NotificationBellProps> = ({
  notificationCount,
  hasUnread = false,
}) => {
  return (
    <div className="relative cursor-pointer">
      <svg
        className={`w-6 h-6 ${hasUnread ? 'text-blue-600' : 'text-gray-700'}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 17h5l-1.405-1.405A2.007 2.007 0 0118 14.586V11a6 6 0 00-12 0v3.586c0 .298-.116.58-.325.795L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
        />
      </svg>
      {notificationCount > 0 && (
        <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full transform">
          {notificationCount > 99 ? '99+' : notificationCount}
        </span>
      )}
      {hasUnread && notificationCount === 0 && (
        <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-3 h-3 bg-blue-600 rounded-full"></span>
      )}
    </div>
  );
};

export default NotificationBell;