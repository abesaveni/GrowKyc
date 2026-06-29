import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface AuctionTimerProps {
  endTime: Date;
  onExpire?: () => void;
}

export function AuctionTimer({ endTime, onExpire }: AuctionTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState<number>(0);

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = new Date().getTime();
      const end = new Date(endTime).getTime();
      const remaining = Math.max(0, end - now);
      return remaining;
    };

    const updateTimer = () => {
      const remaining = calculateTimeRemaining();
      setTimeRemaining(remaining);

      if (remaining === 0 && onExpire) {
        onExpire();
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [endTime, onExpire]);

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days}d ${hours % 24}h ${minutes % 60}m`;
    }
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
    }
    if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    }
    return `${seconds}s`;
  };

  const isUrgent = timeRemaining > 0 && timeRemaining < 60000; // Less than 1 minute
  const isExpired = timeRemaining === 0;

  return (
    <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
      isExpired ? 'bg-white/5 text-slate-400 border-white/10' :
      isUrgent ? 'bg-red-500/10 text-red-300 border-red-500/30 animate-pulse' :
      'bg-indigo-500/10 text-indigo-300 border-indigo-500/30'
    }`}>
      <Clock className="w-4 h-4" />
      <span className="font-semibold text-sm">
        {isExpired ? 'Auction Ended' : formatTime(timeRemaining)}
      </span>
    </div>
  );
}
