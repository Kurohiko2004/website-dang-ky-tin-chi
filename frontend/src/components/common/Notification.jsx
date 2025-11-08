import React, { useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export default function Notification({ message, type = 'info', onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor =
    type === 'success'
      ? 'bg-green-500'
      : type === 'error'
      ? 'bg-red-500'
      : type === 'warning'
      ? 'bg-yellow-500'
      : 'bg-blue-500';

  const Icon =
    type === 'success'
      ? CheckCircle
      : type === 'error'
      ? XCircle
      : AlertCircle;

  return (
    <div
      className={`fixed top-20 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center gap-2 ${bgColor} text-white transition-opacity duration-300`}
      role="alert"
    >
      <Icon size={20} />
      {message}
      <button onClick={onClose} className="ml-4 text-xl font-bold leading-none">
        &times;
      </button>
    </div>
  );
}
