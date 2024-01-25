import { useState, useEffect } from 'react';

export default function UseOnlineStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    // Update network status
    const handleStatusChange = () => {
      setIsOnline(navigator.onLine);
    };
    // Listen to the online status
    window.addEventListener('online', handleStatusChange);
    // Listen to the offline status
    window.addEventListener('offline', handleStatusChange);
    // Specify how to clean up after this effect for performance improvment
    return () => {
      window.removeEventListener('online', handleStatusChange);
      window.removeEventListener('offline', handleStatusChange);
    };
  }, [isOnline]);

  return isOnline;
}
