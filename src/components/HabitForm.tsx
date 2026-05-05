import React, { useState, useEffect } from 'react';
import { Habit, NotificationConfig } from '../types';
import NotificationSettings from './NotificationSettings';

interface HabitFormProps {
  habit?: Habit | null;
  onSubmit: (name: string, notifications: NotificationConfig) => void;
  onCancel: () => void;
}

const defaultNotifications: NotificationConfig = {
  enabled: false,
  days: [true, true, true, true, true, false, false], // Mon-Fri by default
  time: '09:00',
};

export default function HabitForm({ habit, onSubmit, onCancel }: HabitFormProps) {
  const [name, setName] = useState('');
  const [notifications, setNotifications] = useState<NotificationConfig>(defaultNotifications);

  useEffect(() => {
    if (habit) {
      setName(habit.name);
      setNotifications(habit.notifications);
    } else {
      setName('');
      setNotifications(defaultNotifications);
    }
  }, [habit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    onSubmit(trimmed, notifications);
    if (!habit) {
      setName('');
      setNotifications(defaultNotifications);
    }
  };

  const isEdit = !!habit;

  return (
    <form className="habit-form" onSubmit={handleSubmit}>
      <h2 className="form-title">{isEdit ? 'Edit Habit' : 'New Habit'}</h2>
      <div className="form-group">
        <label htmlFor="habit-name" className="form-label">Habit Name</label>
        <input
          id="habit-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Morning run, Read 30 min..."
          className="form-input"
          autoFocus
          required
        />
      </div>
      <NotificationSettings config={notifications} onChange={setNotifications} />
      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          {isEdit ? 'Save Changes' : 'Add Habit'}
        </button>
        <button type="button" className="btn btn-outline" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}
