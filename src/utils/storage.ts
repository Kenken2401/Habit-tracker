import { Habit } from '../types';

const STORAGE_KEY = 'habit-tracker-habits';

export const loadHabits = (): Habit[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as Habit[];
  } catch {
    return [];
  }
};

export const saveHabits = (habits: Habit[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
  } catch {
    console.error('Failed to save habits to localStorage');
  }
};
