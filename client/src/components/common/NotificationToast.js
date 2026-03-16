import React, { useEffect } from 'react';
import { useSocket } from '../../context/SocketContext';

const NotificationToast = ({ notification, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const getIcon = (type) => {
    switch (type) {
      case 'proposal:created':
        return '📝';
      case 'proposal:reviewed':
        return '⭐';
      case 'proposal:statusChanged':
        return '🔄';
      default:
        return '🔔';
    }
  };

  const getColor = (type) => {
    switch (type) {
      case 'proposal:created':
        return 'bg-blue-50 border-blue-200';
      case 'proposal:reviewed':
        return 'bg-green-50 border-green-200';
      case 'proposal:statusChanged':
        return 'bg-purple-50 border-purple-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className={`${getColor(notification.type)} border rounded-lg shadow-lg p-4 mb-2 animate-slideIn`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <span className="text-xl">{getIcon(notification.type)}</span>
          <div>
            <p className="text-sm font-medium text-gray-900 break-all ">{notification.message}</p>
            <p className="text-xs text-gray-500 mt-1">
              {new Date(notification.timestamp).toLocaleTimeString()}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default NotificationToast;