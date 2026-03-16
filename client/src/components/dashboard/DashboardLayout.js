import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../../context/SocketContext';
import NotificationToast from '../common/NotificationToast';

const DashboardLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const { notifications, removeNotification } = useSocket();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="fixed top-4 right-4 z-50 w-80 space-y-2">
        {notifications.map((notification, index) => (
          <NotificationToast
            key={index}
            notification={notification}
            onClose={() => removeNotification(index)}
          />
        ))}
      </div>

      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-xl font-semibold">Talk Proposal App</h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">
                {user?.name} ({user?.role})
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm text-white bg-red-600 rounded hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {children}  {/* This is where role-specific content goes */}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;