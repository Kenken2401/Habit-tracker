import { useState, useEffect } from 'react';
import { Habit } from '../types';
import { canLog, getTimeUntilMidnight } from '../utils/streak';

function formatMs(ms: number): string {
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  if (h > 0) {
    return `${h}h ${String(m).padStart(2, '0')}m`;
  }
  return `${String(m).padStart(2, '0')}m ${String(s).padStart(2, '0')}s`;
}

export default function CountdownTimer({ habit }: { habit: Habit }) {
  const [, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  if (habit.lastLoggedAt === null) {
    return <div className="timer timer-pending">Log to start your streak</div>;
  }

  if (habit.status === 'broken') {
    return <div className="timer timer-broken">Streak broken — log to start recovery</div>;
  }

  if (!canLog(habit)) {
    return <div className="timer timer-logged">Logged today ✓ — resets at midnight</div>;
  }

  const ms = getTimeUntilMidnight();
  return (
    <div className="timer timer-pending">
      <span className="timer-value">{formatMs(ms)}</span>{' '}
      left before streak resets
    </div>
  );
}
