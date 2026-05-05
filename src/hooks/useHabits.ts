import { useState, useEffect, useCallback } from 'react';
import { Habit, NotificationConfig } from '../types';
import { loadHabits, saveHabits } from '../utils/storage';
import {
  logHabit as streakLogHabit,
  updateHabitStatuses,
} from '../utils/streak';
import { rescheduleAllNotifications, cancelHabitNotifications } from '../utils/notifications';

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function createDefaultHabit(name: string, notifications: NotificationConfig): Habit {
  return {
    id: generateId(),
    name,
    createdAt: new Date().toISOString(),
    lastLoggedAt: null,
    streak: 0,
    bestStreak: 0,
    status: 'active',
    recoveryCount: 0,
    preBreakStreak: 0,
    level: 1,
    nextLevelThreshold: 10,
    pendingLevelUp: false,
    levelHistory: [],
    notifications,
  };
}

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [showLevelUpFor, setShowLevelUpFor] = useState<string | null>(null);

  // On mount: load habits, update statuses, reschedule notifications
  useEffect(() => {
    const loaded = loadHabits();
    const updated = updateHabitStatuses(loaded);
    setHabits(updated);
    saveHabits(updated);
    rescheduleAllNotifications(updated);

    // Check if any habit has pendingLevelUp
    const pending = updated.find((h) => h.pendingLevelUp);
    if (pending) {
      setShowLevelUpFor(pending.id);
    }
  }, []);

  // Set up 1-minute interval to re-check streak statuses
  useEffect(() => {
    const interval = setInterval(() => {
      setHabits((prev) => {
        const updated = updateHabitStatuses(prev);
        // Only save if something changed
        const changed = updated.some(
          (h, i) => h.status !== prev[i]?.status || h.streak !== prev[i]?.streak
        );
        if (changed) {
          saveHabits(updated);
          rescheduleAllNotifications(updated);
        }
        return updated;
      });
    }, 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const addHabit = useCallback((name: string, notifications: NotificationConfig) => {
    const newHabit = createDefaultHabit(name, notifications);
    setHabits((prev) => {
      const updated = [...prev, newHabit];
      saveHabits(updated);
      rescheduleAllNotifications(updated);
      return updated;
    });
  }, []);

  const updateHabit = useCallback((id: string, name: string, notifications: NotificationConfig) => {
    setHabits((prev) => {
      const updated = prev.map((h) =>
        h.id === id ? { ...h, name, notifications } : h
      );
      saveHabits(updated);
      rescheduleAllNotifications(updated);
      return updated;
    });
    setEditingHabit(null);
  }, []);

  const deleteHabit = useCallback((id: string) => {
    cancelHabitNotifications(id);
    setHabits((prev) => {
      const updated = prev.filter((h) => h.id !== id);
      saveHabits(updated);
      return updated;
    });
    if (showLevelUpFor === id) {
      setShowLevelUpFor(null);
    }
  }, [showLevelUpFor]);

  const logHabit = useCallback((id: string) => {
    setHabits((prev) => {
      const updated = prev.map((h) => {
        if (h.id !== id) return h;
        const logged = streakLogHabit(h);
        return logged;
      });
      saveHabits(updated);
      rescheduleAllNotifications(updated);

      // Check for pending level up after logging
      const loggedHabit = updated.find((h) => h.id === id);
      if (loggedHabit?.pendingLevelUp && !showLevelUpFor) {
        setShowLevelUpFor(id);
      }

      return updated;
    });
  }, [showLevelUpFor]);

  const completeLevelUp = useCallback((habitId: string, description: string) => {
    setHabits((prev) => {
      const updated = prev.map((h) => {
        if (h.id !== habitId) return h;
        const newLevel = h.level + 1;
        const newEntry = {
          level: newLevel,
          streakDay: h.streak,
          description,
          date: new Date().toISOString(),
        };
        return {
          ...h,
          pendingLevelUp: false,
          level: newLevel,
          nextLevelThreshold: h.nextLevelThreshold + 10,
          levelHistory: [...h.levelHistory, newEntry],
        };
      });
      saveHabits(updated);

      // Check if any other habit has pending level up
      const nextPending = updated.find((h) => h.id !== habitId && h.pendingLevelUp);
      setShowLevelUpFor(nextPending ? nextPending.id : null);

      return updated;
    });
  }, []);

  const dismissLevelUp = useCallback((habitId: string) => {
    setHabits((prev) => {
      const updated = prev.map((h) =>
        h.id === habitId ? { ...h, pendingLevelUp: false } : h
      );
      saveHabits(updated);

      // Check if any other habit has pending level up
      const nextPending = updated.find((h) => h.id !== habitId && h.pendingLevelUp);
      setShowLevelUpFor(nextPending ? nextPending.id : null);

      return updated;
    });
  }, []);

  const startEditing = useCallback((habit: Habit) => {
    setEditingHabit(habit);
  }, []);

  const cancelEditing = useCallback(() => {
    setEditingHabit(null);
  }, []);

  return {
    habits,
    editingHabit,
    showLevelUpFor,
    addHabit,
    updateHabit,
    deleteHabit,
    logHabit,
    completeLevelUp,
    dismissLevelUp,
    startEditing,
    cancelEditing,
  };
}
