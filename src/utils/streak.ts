import { Habit } from '../types';

function isToday(dateStr: string): boolean {
  const d = new Date(dateStr);
  const now = new Date();
  return d.getFullYear() === now.getFullYear() &&
         d.getMonth() === now.getMonth() &&
         d.getDate() === now.getDate();
}

function isYesterday(dateStr: string): boolean {
  const d = new Date(dateStr);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return d.getFullYear() === yesterday.getFullYear() &&
         d.getMonth() === yesterday.getMonth() &&
         d.getDate() === yesterday.getDate();
}

// Can log if never logged, or hasn't logged today yet
export function canLog(habit: Habit): boolean {
  if (habit.lastLoggedAt === null) return true;
  return !isToday(habit.lastLoggedAt);
}

// Streak is broken when at least one full calendar day was skipped
export function isStreakBroken(habit: Habit): boolean {
  if (habit.lastLoggedAt === null) return false;
  return !isToday(habit.lastLoggedAt) && !isYesterday(habit.lastLoggedAt);
}

// ms until midnight — the deadline to log before today's streak slot expires
export function getTimeUntilMidnight(): number {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  return midnight.getTime() - now.getTime();
}

export function logHabit(habit: Habit): Habit {
  const now = new Date().toISOString();
  let updated: Habit = { ...habit, lastLoggedAt: now };

  if (habit.status === 'active') {
    updated.streak = habit.streak + 1;
  } else if (habit.status === 'broken') {
    updated.status = 'recovery';
    updated.streak = 1;
    updated.recoveryCount = 1;
  } else if (habit.status === 'recovery') {
    updated.streak = habit.streak + 1;
    updated.recoveryCount = habit.recoveryCount + 1;
    if (updated.recoveryCount >= 3) {
      updated.status = 'active';
      updated.streak = habit.preBreakStreak + 3;
    }
  }

  if (updated.streak > updated.bestStreak) {
    updated.bestStreak = updated.streak;
  }

  if (
    updated.streak > 0 &&
    updated.streak % 10 === 0 &&
    updated.streak >= updated.nextLevelThreshold
  ) {
    updated.pendingLevelUp = true;
  }

  return updated;
}

export function updateHabitStatuses(habits: Habit[]): Habit[] {
  return habits.map((habit) => {
    if (
      (habit.status === 'active' || habit.status === 'recovery') &&
      isStreakBroken(habit)
    ) {
      return {
        ...habit,
        status: 'broken',
        preBreakStreak: habit.streak,
        streak: 0,
        recoveryCount: 0,
      };
    }
    return habit;
  });
}
