import { Habit } from '../types';
import HabitCard from './HabitCard';

interface HabitListProps {
  habits: Habit[];
  onLog: (id: string) => void;
  onEdit: (habit: Habit) => void;
  onDelete: (id: string) => void;
}

export default function HabitList({ habits, onLog, onEdit, onDelete }: HabitListProps) {
  if (habits.length === 0) {
    return (
      <div className="empty-state">
        <p className="empty-title">No habits yet</p>
        <p className="empty-subtitle">Add your first habit to start building streaks.</p>
      </div>
    );
  }

  return (
    <ul className="habit-list">
      {habits.map((habit) => (
        <li key={habit.id}>
          <HabitCard
            habit={habit}
            onLog={onLog}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </li>
      ))}
    </ul>
  );
}
