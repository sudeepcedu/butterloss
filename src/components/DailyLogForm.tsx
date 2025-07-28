import React, { useState } from 'react';
import { DailyLog } from '../types';
import { format } from 'date-fns';
import './DailyLogForm.css';

interface DailyLogFormProps {
  onLogSubmit: (log: DailyLog) => void;
  currentWeight: number;
}

const DailyLogForm: React.FC<DailyLogFormProps> = ({ onLogSubmit, currentWeight }) => {
  const [deficit, setDeficit] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const today = format(new Date(), 'yyyy-MM-dd');
    const log: DailyLog = {
      date: today,
      deficit: parseInt(deficit),
      weight: null
    };
    onLogSubmit(log);
    setDeficit('');
  };

  return (
    <div className="daily-log-form">
      <h3>📝 Log Today's Progress</h3>
      <form onSubmit={handleSubmit} className="log-form">
        <div className="form-group">
          <label htmlFor="deficit">Calorie Deficit</label>
          <input
            type="number"
            id="deficit"
            value={deficit}
            onChange={(e) => setDeficit(e.target.value)}
            required
            placeholder="Enter today's deficit"
          />
          <small>calories (negative if you ate more than burned)</small>
        </div>

        <button type="submit" className="log-btn">
          Log Progress ✅
        </button>
      </form>
    </div>
  );
};

export default DailyLogForm; 