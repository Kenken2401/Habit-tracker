import { Habit } from '../types';

const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;
const FORTY_EIGHT_HOURS = 48 * 60 * 60 * 1000;

/**
 * Returns true if the habit can be logged (never logged, or last logged more than 24h ago)
 */
export function canLog(habit: Habit): boolean {
  if (habit.lastLoggedAt === null) return true;
  const lastLogged = new Date(habit.lastLoggedAt).getTime();
  const now = Date.now();
  return now - lastLogged > TWENTY_FOUR_HOURS;
}

/**
 * Returns true if the streak should be considered broken
 * (was logged before, but more than 48h have passed without logging)
 */
export function isStreakBroken(habit: Habit): boolean {
  if (habit.lastLoggedAt === null) {
    // Never logged — check 48h from creation
    const created = new Date(habit.createdAt).getTime();
    return Date.now() - created > FORTY_EIGHT_HOURS;
  }
  const lastLogged = new Date(habit.lastLoggedAt).getTime();
  return Date.now() - lastLogged > FORTY_EIGHT_HOURS;
}

/**
 * Log a habit — returns an updated copy of the habit
 */
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

  // Update best streak
  if (updated.streak > updated.bestStreak) {
    updated.bestStreak = updated.streak;
  }

  // Check for level up
  if (
    updated.streak > 0 &&
    updated.streak % 10 === 0 &&
    updated.streak >= updated.nextLevelThreshold
  ) {
    updated.pendingLevelUp = true;
  }

  return updated;
}

/**
 * Update statuses for all habits — call on app load or periodically
 */
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

/**
 * Returns ms until user can log again (24h after lastLoggedAt)
 * Returns 0 if can already log
 */
export function getTimeUntilNextWindow(habit: Habit): number {
  if (habit.lastLoggedAt === null) return 0;
  const lastLogged = new Date(habit.lastLoggedAt).getTime();
  const nextWindow = lastLogged + TWENTY_FOUR_HOURS;
  const remaining = nextWindow - Date.now();
  return Math.max(0, remaining);
}

/**
 * Returns ms until streak breaks if not logged
 * (48h after lastLoggedAt, or 48h from createdAt if never logged)
 */
export function getTimeUntilExpiry(habit: Habit): number {
  const base = habit.lastLoggedAt
    ? new Date(habit.lastLoggedAt).getTime()
    : new Date(habit.createdAt).getTime();
  const expiry = base + FORTY_EIGHT_HOURS;
  const remaining = expiry - Date.now();
  return Math.max(0, remaining);
}
