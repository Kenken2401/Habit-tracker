import { useState } from 'react';
import { Habit } from '../types';
import { canLog } from '../utils/streak';
import CountdownTimer from './CountdownTimer';
import LevelHistory from './LevelHistory';

interface HabitCardProps {
  habit: Habit;
  onLog: (id: string) => void;
  onEdit: (habit: Habit) => void;
  onDelete: (id: string) => void;
}

const STATUS_LABEL: Record<string, string> = {
  active: 'Active',
  broken: 'Broken',
  recovery: 'Recovery',
};

export default function HabitCard({ habit, onLog, onEdit, onDelete }: HabitCardProps) {
  const [showHistory, setShowHistory] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const logged = !canLog(habit);
  const eligible = canLog(habit);

  const handleLog = () => {
    if (eligible) onLog(habit.id);
  };

  const handleDelete = () => {
    if (confirmDelete) {
      onDelete(habit.id);
    } else {
      setConfirmDelete(true);
    }
  };

  return (
    <div className={`habit-card habit-card--${habit.status}`}>
      {habit.pendingLevelUp && (
        <div className="levelup-banner">
          Day {habit.streak} — Ready to level up?
        </div>
      )}

      <div className="habit-card-header">
        <div className="habit-card-meta">
          <span className={`status-badge status-badge--${habit.status}`}>
            {STATUS_LABEL[habit.status]}
          </span>
          <span className="level-badge">Lv {habit.level}</span>
        </div>
        <div className="habit-card-actions">
          <button
            className="icon-btn"
            onClick={() => onEdit(habit)}
            title="Edit habit"
          >
            Edit
          </button>
          <button
            className={`icon-btn icon-btn--danger ${confirmDelete ? 'confirming' : ''}`}
            onClick={handleDelete}
            onBlur={() => setConfirmDelete(false)}
            title={confirmDelete ? 'Click again to confirm' : 'Delete habit'}
          >
            {confirmDelete ? 'Sure?' : 'Delete'}
          </button>
        </div>
      </div>

      <div className="habit-card-body">
        <div className="habit-checkbox-row">
          <button
            className={`habit-checkbox ${logged ? 'checked' : ''} ${!eligible ? 'disabled' : ''}`}
            onClick={handleLog}
            disabled={!eligible}
            aria-label={logged ? 'Logged today' : 'Mark as done'}
            title={logged ? 'Already logged' : 'Mark as done'}
          >
            {logged && <span className="checkmark">✓</span>}
          </button>
          <h3 className="habit-name">{habit.name}</h3>
        </div>

        <div className="streak-display">
          <span className="streak-number">{habit.streak}</span>
          <span className="streak-label">day streak</span>
        </div>

        {habit.bestStreak > 0 && (
          <div className="best-streak">Best: {habit.bestStreak} days</div>
        )}
      </div>

      <div className="habit-card-footer">
        <CountdownTimer habit={habit} />

        {habit.status === 'recovery' && (
          <div className="recovery-info">
            Recovery: {habit.recoveryCount}/3 days to restore {habit.preBreakStreak}-day streak
          </div>
        )}

        {habit.levelHistory.length > 0 && (
          <button
            className="history-toggle"
            onClick={() => setShowHistory((v) => !v)}
          >
            {showHistory ? 'Hide' : 'Show'} level history ({habit.levelHistory.length})
          </button>
        )}
      </div>

      {showHistory && <LevelHistory history={habit.levelHistory} />}
    </div>
  );
}
