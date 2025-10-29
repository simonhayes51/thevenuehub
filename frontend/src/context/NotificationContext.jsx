import { createContext, useContext, useState } from 'react';
import { FaCheck, FaTimes, FaExclamationTriangle, FaInfoCircle } from 'react-icons/fa';

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (message, type = 'info', duration = 5000) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type, duration }]);
    if (duration > 0) setTimeout(() => removeNotification(id), duration);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const success = (message, duration) => addNotification(message, 'success', duration);
  const error = (message, duration) => addNotification(message, 'error', duration);
  const warning = (message, duration) => addNotification(message, 'warning', duration);
  const info = (message, duration) => addNotification(message, 'info', duration);

  return (
    <NotificationContext.Provider value={{ success, error, warning, info }}>
      {children}
      <div className="fixed top-4 right-4 z-[200] space-y-2 max-w-md">
        {notifications.map(notification => (
          <Notification
            key={notification.id}
            {...notification}
            onClose={() => removeNotification(notification.id)}
          />
        ))}
      </div>
    </NotificationContext.Provider>
  );
}

function Notification({ id, message, type, onClose }) {
  const icons = {
    success: <FaCheck className="text-[#05ffa1]" />,
    error: <FaTimes className="text-[#ff2a6d]" />,
    warning: <FaExclamationTriangle className="text-[#fffc00]" />,
    info: <FaInfoCircle className="text-[#00fff9]" />,
  };

  const colors = {
    success: 'border-[#05ffa1]',
    error: 'border-[#ff2a6d]',
    warning: 'border-[#fffc00]',
    info: 'border-[#00fff9]',
  };

  return (
    <div className={`card p-4 flex items-center gap-3 border-2 ${colors[type]} animate-fade-in backdrop-blur-xl`}>
      <div className="text-2xl">{icons[type]}</div>
      <div className="flex-1 font-bold">{message}</div>
      <button onClick={onClose} className="pill" aria-label="Close notification">
        <FaTimes />
      </button>
    </div>
  );
}

export function useNotifications() {
  return useContext(NotificationContext);
}
