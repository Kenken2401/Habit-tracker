import { LevelEntry } from '../types';

interface LevelHistoryProps {
  history: LevelEntry[];
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default function LevelHistory({ history }: LevelHistoryProps) {
  if (history.length === 0) {
    return (
      <div className="level-history-empty">
        No level-ups yet. Keep your streak going!
      </div>
    );
  }

  return (
    <div className="level-history">
      <h4 className="level-history-title">Level History</h4>
      <ul className="level-history-list">
        {history.map((entry) => (
          <li key={entry.level} className="level-history-item">
            <div className="level-history-header">
              <span className="level-history-badge">Lv {entry.level}</span>
              <span className="level-history-day">Day {entry.streakDay}</span>
              <span className="level-history-date">{formatDate(entry.date)}</span>
            </div>
            <p className="level-history-desc">{entry.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
