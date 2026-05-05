import React, { useState } from 'react';
import { Habit } from '../types';

interface LevelUpModalProps {
  habit: Habit;
  onComplete: (description: string) => void;
  onDismiss: () => void;
}

export default function LevelUpModal({ habit, onComplete, onDismiss }: LevelUpModalProps) {
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = description.trim();
    if (!trimmed) return;
    onComplete(trimmed);
  };

  return (
    <div className="modal-overlay" onClick={onDismiss}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-streak-number">{habit.streak}</div>
        <h2 className="modal-title">Consecutive Days!</h2>
        <p className="modal-habit-name">{habit.name}</p>
        <p className="modal-subtitle">
          You've hit a milestone. How will you level up this habit?
        </p>
        <form onSubmit={handleSubmit}>
          <textarea
            className="modal-textarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. Increase from 5 min to 10 min, add a new challenge..."
            rows={3}
            autoFocus
          />
          <div className="modal-actions">
            <button type="submit" className="btn btn-primary" disabled={!description.trim()}>
              Level Up
            </button>
            <button type="button" className="btn btn-outline" onClick={onDismiss}>
              Not Now
            </button>
          </div>
        </form>
        <p className="modal-level-note">
          Current level: {habit.level} → Level {habit.level + 1}
        </p>
      </div>
    </div>
  );
}
