export type StreakStatus = 'active' | 'broken' | 'recovery';

export interface LevelEntry {
  level: number;
  streakDay: number;
  description: string;
  date: string;
}

export interface NotificationConfig {
  enabled: boolean;
  days: boolean[]; // [Mon, Tue, Wed, Thu, Fri, Sat, Sun]
  time: string;    // "HH:MM"
}

export interface Habit {
  id: string;
  name: string;
  createdAt: string;
  lastLoggedAt: string | null;
  streak: number;
  bestStreak: number;
  status: StreakStatus;
  recoveryCount: number;    // consecutive days logged in recovery
  preBreakStreak: number;   // streak value before it broke
  level: number;
  nextLevelThreshold: number; // 10, 20, 30...
  pendingLevelUp: boolean;
  levelHistory: LevelEntry[];
  notifications: NotificationConfig;
}
