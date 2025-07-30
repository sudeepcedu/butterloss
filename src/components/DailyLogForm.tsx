import React, { useState, useEffect, useRef } from 'react';
import { DailyLog } from '../types';
import { format } from 'date-fns';
import './DailyLogForm.css';

interface DailyLogFormProps {
  onLogSubmit: (log: DailyLog) => void;
  currentWeight: number;
  todayLog?: DailyLog | null;
  logsLength?: number;
  resetFlag?: number;
  autoFillDeficit?: number | null;
  currentDeficitCalculation?: number | null;
  onDeficitChange?: (deficit: number | null) => void;
  onDeficitInputChange?: (deficit: number | null) => void;
}

const DailyLogForm: React.FC<DailyLogFormProps> = ({ onLogSubmit, currentWeight, todayLog, logsLength = 0, resetFlag = 0, autoFillDeficit, currentDeficitCalculation, onDeficitChange, onDeficitInputChange }) => {
  const [deficit, setDeficit] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(!!todayLog);
  const [loggedDeficit, setLoggedDeficit] = useState<number | null>(todayLog?.deficit || null);
  const deficitInputRef = useRef<HTMLInputElement>(null);

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

  // Handle auto-fill deficit
  useEffect(() => {
    if (autoFillDeficit !== null && autoFillDeficit !== undefined) {
      setDeficit(autoFillDeficit.toString());
      setShowConfirmation(false);
      // Focus on the deficit input field
      setTimeout(() => {
        deficitInputRef.current?.focus();
        // Auto-submit after autofill
        if (deficitInputRef.current && autoFillDeficit !== null && autoFillDeficit !== undefined && !isNaN(autoFillDeficit)) {
          // Auto-submit using the autoFillDeficit value directly
          const today = format(new Date(), 'yyyy-MM-dd');
          const log: DailyLog = {
            date: today,
            deficit: autoFillDeficit,
            weight: null
          };
          onLogSubmit(log);
          setLoggedDeficit(autoFillDeficit);
          setShowConfirmation(true);
        }
      }, 100);
    }
  }, [autoFillDeficit, onLogSubmit]);

  // Notify parent when deficit changes
  useEffect(() => {
    if (onDeficitChange) {
      const deficitValue = deficit ? parseInt(deficit) : null;
      onDeficitChange(deficitValue);
    }
  }, [deficit, onDeficitChange]);

  // Update deficit field when calculation changes (but only if user hasn't manually entered a deficit)
  useEffect(() => {
    if (currentDeficitCalculation !== null && currentDeficitCalculation !== undefined && !showConfirmation) {
      // Only update if the deficit field is empty or has the default value
      if (!deficit || deficit === '0') {
        setDeficit(currentDeficitCalculation.toString());
      }
    }
  }, [currentDeficitCalculation, showConfirmation]);



  // Only update deficit input when autoFillDeficit is triggered (Enter key in food field)
  useEffect(() => {
    if (autoFillDeficit !== null && autoFillDeficit !== undefined) {
      setDeficit(autoFillDeficit.toString());
      setShowConfirmation(false);
      // Focus on the deficit input field
      setTimeout(() => {
        deficitInputRef.current?.focus();
        // Auto-submit after autofill
        if (deficitInputRef.current && autoFillDeficit !== null && autoFillDeficit !== undefined && !isNaN(autoFillDeficit)) {
          // Auto-submit using the autoFillDeficit value directly
          const today = format(new Date(), 'yyyy-MM-dd');
          const log: DailyLog = {
            date: today,
            deficit: autoFillDeficit,
            weight: null
          };
          onLogSubmit(log);
          setLoggedDeficit(autoFillDeficit);
          setShowConfirmation(true);
        }
      }, 100);
    }
  }, [autoFillDeficit, onLogSubmit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const deficitValue = parseInt(deficit);
    
    // Validate that we have a valid number
    if (isNaN(deficitValue)) {
      console.error('Invalid deficit value:', deficit);
      return;
    }
    
    // Trigger food eaten update when deficit is submitted
    if (onDeficitInputChange) {
      onDeficitInputChange(deficitValue);
    }
    
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

  const handleDeficitBlur = () => {
    const deficitValue = parseInt(deficit);
    if (!isNaN(deficitValue) && onDeficitInputChange) {
      onDeficitInputChange(deficitValue);
    }
  };

  const handleEdit = () => {
    setShowConfirmation(false);
    // Restore the previously entered deficit value
    if (loggedDeficit !== null) {
      setDeficit(loggedDeficit.toString());
    }
    // Focus on the deficit input field after a short delay to ensure the form is rendered
    setTimeout(() => {
      deficitInputRef.current?.focus();
    }, 100);
  };



  return (
    <div className="daily-log-form">
      <h3>📝 Log Today's Progress</h3>
      
      {!showConfirmation ? (
        <form onSubmit={handleSubmit} className="log-form">
          <div className="form-group">
            <label htmlFor="deficit">Calorie Deficit</label>
            <input
              ref={deficitInputRef}
              type="number"
              id="deficit"
              value={deficit}
              onChange={(e) => setDeficit(e.target.value)}
              onBlur={handleDeficitBlur}
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
              <p>You've logged <strong className={loggedDeficit && loggedDeficit < 0 ? 'negative-calories' : ''}>{loggedDeficit}</strong> calories deficit for today.</p>
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