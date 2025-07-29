import React, { useState, useEffect } from 'react';
import { DailyLog } from '../types';
import { format } from 'date-fns';
import './DailyLogForm.css';

interface DailyLogFormProps {
  onLogSubmit: (log: DailyLog) => void;
  currentWeight: number;
  todayLog?: DailyLog | null;
  logsLength?: number;
  resetFlag?: number;
}

const DailyLogForm: React.FC<DailyLogFormProps> = ({ onLogSubmit, currentWeight, todayLog, logsLength = 0, resetFlag = 0 }) => {
  const [deficit, setDeficit] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(!!todayLog);
  const [loggedDeficit, setLoggedDeficit] = useState<number | null>(todayLog?.deficit || null);

  // Reset state when todayLog changes (e.g., after restart journey)
  useEffect(() => {
    console.log('DailyLogForm useEffect - todayLog:', todayLog, 'logsLength:', logsLength, 'resetFlag:', resetFlag);
    
    // Only show confirmation if there's a valid log for today
    const hasValidLog = todayLog && todayLog.deficit !== null && todayLog.deficit !== undefined;
    console.log('Has valid log for today:', hasValidLog);
    
    if (hasValidLog) {
      console.log('Setting confirmation to true with deficit:', todayLog.deficit);
      setShowConfirmation(true);
      setLoggedDeficit(todayLog.deficit);
    } else {
      console.log('Setting confirmation to false - no valid log');
      setShowConfirmation(false);
      setLoggedDeficit(null);
    }
    setDeficit('');
  }, [todayLog, logsLength, resetFlag]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const deficitValue = parseInt(deficit);
    const today = format(new Date(), 'yyyy-MM-dd');
    const log: DailyLog = {
      date: today,
      deficit: deficitValue,
      weight: null
    };
    onLogSubmit(log);
    setLoggedDeficit(deficitValue);
    setShowConfirmation(true);
  };

  const handleEdit = () => {
    setShowConfirmation(false);
  };

  return (
    <div className="daily-log-form">
      <h3>📝 Log Today's Progress</h3>
      
      {!showConfirmation ? (
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
      ) : (
        <div className="log-confirmation">
          <div className="confirmation-message">
            <div className="confirmation-icon">🧈</div>
            <div className="confirmation-text">
              <p>You've logged <strong>{loggedDeficit}</strong> calories for today.</p>
              <p>Come back tomorrow to keep the streak going! 🔥</p>
            </div>
          </div>
          <div className="confirmation-actions">
            <button 
              type="button" 
              className="edit-btn"
              onClick={handleEdit}
            >
              Edit
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DailyLogForm; 