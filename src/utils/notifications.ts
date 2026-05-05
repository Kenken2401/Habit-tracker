import { Habit } from '../types';

// Store timeout IDs keyed by habitId
const notificationTimeouts: Map<string, ReturnType<typeof setTimeout>[]> = new Map();

export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!('Notification' in window)) return false;
  if (Notification.permission === 'granted') return true;
  if (Notification.permission === 'denied') return false;

  const result = await Notification.requestPermission();
  return result === 'granted';
};

// Day names for UI: [Mon, Tue, Wed, Thu, Fri, Sat, Sun]
export const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const scheduleHabitNotifications = (habit: Habit): void => {
  // Cancel any existing timeouts for this habit first
  cancelHabitNotifications(habit.id);

  if (!habit.notifications.enabled) return;
  if (!('Notification' in window)) return;
  if (Notification.permission !== 'granted') return;

  const now = new Date();
  // JS getDay() returns 0=Sun, 1=Mon, ..., 6=Sat
  // Our days array is [Mon, Tue, Wed, Thu, Fri, Sat, Sun] (index 0=Mon)
  // Map JS day to our index: Sun(0)->6, Mon(1)->0, Tue(2)->1, ..., Sat(6)->5
  const jsDayToIndex = (jsDay: number) => (jsDay === 0 ? 6 : jsDay - 1);

  const todayIndex = jsDayToIndex(now.getDay());

  const timeouts: ReturnType<typeof setTimeout>[] = [];

  // Only schedule for today if it's enabled and the time hasn't passed
  if (habit.notifications.days[todayIndex]) {
    const [hours, minutes] = habit.notifications.time.split(':').map(Number);
    const targetTime = new Date(now);
    targetTime.setHours(hours, minutes, 0, 0);

    const msUntilNotification = targetTime.getTime() - now.getTime();

    if (msUntilNotification > 0) {
      const timeoutId = setTimeout(() => {
        if (Notification.permission === 'granted') {
          new Notification(`Time to log: ${habit.name}`, {
            body: `Keep your streak going! Current streak: ${habit.streak} days.`,
            icon: '/favicon.ico',
          });
        }
      }, msUntilNotification);

      timeouts.push(timeoutId);
    }
  }

  notificationTimeouts.set(habit.id, timeouts);
};

export const cancelHabitNotifications = (habitId: string): void => {
  const existing = notificationTimeouts.get(habitId);
  if (existing) {
    existing.forEach((id) => clearTimeout(id));
    notificationTimeouts.delete(habitId);
  }
};

export const rescheduleAllNotifications = (habits: Habit[]): void => {
  habits.forEach((habit) => scheduleHabitNotifications(habit));
};
