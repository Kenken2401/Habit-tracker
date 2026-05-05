import { useState, useEffect } from 'react';
import { Habit } from '../types';
import { canLog, getTimeUntilNextWindow, getTimeUntilExpiry } from '../utils/streak';

function formatMs(ms: number): string {
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

interface CountdownTimerProps {
  habit: Habit;
}

export default function CountdownTimer({ habit }: CountdownTimerProps) {
  const [, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  if (habit.lastLoggedAt === null) {
    return (
      <div className="timer timer-pending">
        Log to start your streak
      </div>
    );
  }

  if (habit.status === 'broken' && canLog(habit)) {
    return (
      <div className="timer timer-broken">
        Streak broken — log to start recovery
      </div>
    );
  }

  if (!canLog(habit)) {
    const ms = getTimeUntilNextWindow(habit);
    return (
      <div className="timer timer-logged">
        Next window in <span className="timer-value">{formatMs(ms)}</span>
      </div>
    );
  }

  const ms = getTimeUntilExpiry(habit);
  if (ms === 0) {
    return (
      <div className="timer timer-expired">
        Window expired
      </div>
    );
  }

  return (
    <div className="timer timer-pending">
      Log before <span className="timer-value">{formatMs(ms)}</span>
    </div>
  );
}
