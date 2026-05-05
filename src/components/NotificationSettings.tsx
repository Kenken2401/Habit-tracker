import React from 'react';
import { NotificationConfig } from '../types';
import { DAY_NAMES } from '../utils/notifications';

interface NotificationSettingsProps {
  config: NotificationConfig;
  onChange: (config: NotificationConfig) => void;
}

export default function NotificationSettings({ config, onChange }: NotificationSettingsProps) {
  const handleToggle = () => {
    onChange({ ...config, enabled: !config.enabled });
  };

  const handleDayToggle = (index: number) => {
    const newDays = [...config.days] as boolean[];
    newDays[index] = !newDays[index];
    onChange({ ...config, days: newDays });
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...config, time: e.target.value });
  };

  return (
    <div className="notification-settings">
      <div className="notification-toggle-row">
        <span className="notification-label">Reminders</span>
        <button
          type="button"
          className={`toggle-btn ${config.enabled ? 'toggle-on' : 'toggle-off'}`}
          onClick={handleToggle}
          aria-pressed={config.enabled}
        >
          {config.enabled ? 'ON' : 'OFF'}
        </button>
      </div>

      {config.enabled && (
        <div className="notification-details">
          <div className="day-selector">
            {DAY_NAMES.map((day, index) => (
              <button
                key={day}
                type="button"
                className={`day-btn ${config.days[index] ? 'day-active' : ''}`}
                onClick={() => handleDayToggle(index)}
              >
                {day}
              </button>
            ))}
          </div>
          <div className="time-selector">
            <label htmlFor="notification-time" className="time-label">Time</label>
            <input
              id="notification-time"
              type="time"
              value={config.time}
              onChange={handleTimeChange}
              className="time-input"
            />
          </div>
        </div>
      )}
    </div>
  );
}
