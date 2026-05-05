import { useState } from 'react';
import { useHabits } from './hooks/useHabits';
import HabitList from './components/HabitList';
import HabitForm from './components/HabitForm';
import LevelUpModal from './components/LevelUpModal';
import { NotificationConfig } from './types';

export default function App() {
  const {
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
  } = useHabits();

  const [showAddForm, setShowAddForm] = useState(false);

  const handleAdd = (name: string, notifications: NotificationConfig) => {
    addHabit(name, notifications);
    setShowAddForm(false);
  };

  const handleUpdate = (name: string, notifications: NotificationConfig) => {
    if (editingHabit) {
      updateHabit(editingHabit.id, name, notifications);
    }
  };

  const levelUpHabit = showLevelUpFor
    ? habits.find((h) => h.id === showLevelUpFor)
    : null;

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">Habit Tracker</h1>
        {!showAddForm && !editingHabit && (
          <button
            className="btn btn-primary"
            onClick={() => setShowAddForm(true)}
          >
            + Add Habit
          </button>
        )}
      </header>

      <main className="app-main">
        {(showAddForm || editingHabit) && (
          <div className="form-container">
            <HabitForm
              habit={editingHabit}
              onSubmit={editingHabit ? handleUpdate : handleAdd}
              onCancel={editingHabit ? cancelEditing : () => setShowAddForm(false)}
            />
          </div>
        )}

        <HabitList
          habits={habits}
          onLog={logHabit}
          onEdit={(habit) => {
            setShowAddForm(false);
            startEditing(habit);
          }}
          onDelete={deleteHabit}
        />
      </main>

      {levelUpHabit && (
        <LevelUpModal
          habit={levelUpHabit}
          onComplete={(desc) => completeLevelUp(levelUpHabit.id, desc)}
          onDismiss={() => dismissLevelUp(levelUpHabit.id)}
        />
      )}
    </div>
  );
}
